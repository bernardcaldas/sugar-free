import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with SERVICE_ROLE_KEY to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        // Fetch last 45 days of logs using admin client (bypasses RLS)
        const { data: logs, error } = await supabaseAdmin
            .from("daily_logs")
            .select("*")
            .eq("user_id", userId)
            .order("date", { ascending: false })
            .limit(45);

        console.log("[AI Insights Debug] userId:", userId);
        console.log("[AI Insights Debug] logs fetched:", logs?.length ?? 0);
        console.log("[AI Insights Debug] error:", error?.message ?? "none");

        if (error) {
            console.error("[AI Insights] Supabase error:", error);
            return NextResponse.json(getFallbackInsights());
        }

        if (!logs || logs.length < 3) {
            console.log("[AI Insights] Not enough data for analysis, returning fallback");
            return NextResponse.json(getFallbackInsights());
        }

        // Log sample data for debugging
        console.log("[AI Insights Debug] Sample log:", JSON.stringify(logs[0]));

        // Calculate stats locally for richer context
        const totalDays = logs.length;
        const successDays = logs.filter(l => l.success).length;
        const failDays = totalDays - successDays;
        const successRate = Math.round((successDays / totalDays) * 100);

        // Count triggers
        const triggerCounts: Record<string, number> = {};
        const moodOnSuccess: Record<string, number> = {};
        const failuresByDayOfWeek: Record<string, number> = {};
        const totalByDayOfWeek: Record<string, number> = {};

        const weekendDayNames = ["sábado", "domingo"];
        let weekdayTotal = 0, weekdayFails = 0;
        let weekendTotal = 0, weekendFails = 0;

        logs.forEach(log => {
            const dayName = new Date(log.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long" });
            totalByDayOfWeek[dayName] = (totalByDayOfWeek[dayName] || 0) + 1;

            const isWeekend = weekendDayNames.includes(dayName);
            if (isWeekend) {
                weekendTotal++;
            } else {
                weekdayTotal++;
            }

            if (!log.success) {
                // Count triggers
                if (log.trigger) {
                    triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
                }
                // Count failure days
                failuresByDayOfWeek[dayName] = (failuresByDayOfWeek[dayName] || 0) + 1;
                if (isWeekend) {
                    weekendFails++;
                } else {
                    weekdayFails++;
                }
            }

            if (log.success && log.mood) {
                moodOnSuccess[log.mood] = (moodOnSuccess[log.mood] || 0) + 1;
            }
        });

        // Find top trigger
        const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
        // Find riskiest day (by failure rate, not just count)
        const riskiestDay = Object.entries(failuresByDayOfWeek).sort((a, b) => {
            const rateA = a[1] / (totalByDayOfWeek[a[0]] || 1);
            const rateB = b[1] / (totalByDayOfWeek[b[0]] || 1);
            return rateB - rateA;
        })[0];
        // Find best mood on success
        const bestMood = Object.entries(moodOnSuccess).sort((a, b) => b[1] - a[1])[0];

        // Today's day name for risk context
        const todayDayName = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
        const weekdayFailRate = weekdayTotal > 0 ? Math.round((weekdayFails / weekdayTotal) * 100) : 0;
        const weekendFailRate = weekendTotal > 0 ? Math.round((weekendFails / weekendTotal) * 100) : 0;

        // Calculate current streak
        let currentStreak = 0;
        const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
        for (const log of sortedLogs) {
            if (log.success) currentStreak++;
            else break;
        }

        console.log("[AI Insights Debug] Stats:", {
            totalDays, successDays, failDays, successRate,
            topTrigger, riskiestDay, bestMood, currentStreak
        });

        const prompt = `You are an empathetic health coach analyzing a user's sugar-free journey data.
The user is Brazilian, respond in Portuguese (pt-BR).

## User Stats Summary
- Total days tracked: ${totalDays}
- Sugar-free days: ${successDays} (${successRate}%)
- Relapse days: ${failDays}
- Current streak: ${currentStreak} days
- Top relapse trigger: ${topTrigger ? `${topTrigger[0]} (${topTrigger[1]} times, ${Math.round((topTrigger[1] / Math.max(failDays, 1)) * 100)}% of relapses)` : "No trigger data yet"}
- Riskiest day of week: ${riskiestDay ? `${riskiestDay[0]} (${riskiestDay[1]} failures out of ${totalByDayOfWeek[riskiestDay[0]] || 0} tracked, ${totalByDayOfWeek[riskiestDay[0]] ? Math.round((riskiestDay[1] / totalByDayOfWeek[riskiestDay[0]]) * 100) : 0}% failure rate)` : "No pattern detected"}
- Most common mood on success: ${bestMood ? `${bestMood[0]} (${bestMood[1]} times)` : "No mood data yet"}
- Today is: ${todayDayName}

## Failure distribution by day of week (IMPORTANT — use this for riskRadar)
${Object.entries(failuresByDayOfWeek)
                .sort((a, b) => {
                    const rateA = a[1] / (totalByDayOfWeek[a[0]] || 1);
                    const rateB = b[1] / (totalByDayOfWeek[b[0]] || 1);
                    return rateB - rateA;
                })
                .map(([day, count]) => `- ${day}: ${count} failures / ${totalByDayOfWeek[day] || 0} days tracked (${totalByDayOfWeek[day] ? Math.round((count / totalByDayOfWeek[day]) * 100) : 0}% failure rate)`)
                .join("\n") || "No day-of-week data"}

Days with ZERO failures: ${["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"]
                .filter(d => !failuresByDayOfWeek[d])
                .join(", ") || "None"}

## Weekday vs Weekend comparison
- Weekday failures: ${weekdayFails}/${weekdayTotal} days (${weekdayFailRate}% failure rate)
- Weekend failures: ${weekendFails}/${weekendTotal} days (${weekendFailRate}% failure rate)
- Pattern: ${weekendFailRate > weekdayFailRate ? "Weekend is riskier" : weekdayFailRate > weekendFailRate ? "Weekdays are riskier" : "Similar risk"}

## Trigger breakdown
${Object.entries(triggerCounts).map(([t, c]) => `- ${t}: ${c} times`).join("\n") || "No trigger data"}

## Mood on success days
${Object.entries(moodOnSuccess).map(([m, c]) => `- ${m}: ${c} times`).join("\n") || "No mood data"}

## Raw data (last ${logs.length} entries)
${JSON.stringify(logs.map(l => ({ date: l.date, success: l.success, mood: l.mood, trigger: l.trigger })))}

Generate 4 personalized insights as JSON. Be specific, use the actual data, reference their real triggers and moods. DO NOT be generic.

CRITICAL RULES for riskRadar:
- The "dayOfWeek" MUST be the day with the HIGHEST failure RATE from the "Failure distribution by day of week" section above.
- If a day has ZERO failures in the history, it MUST NOT be selected as the riskiest day.
- The "riskLevel" should be HIGH if today matches or is near the riskiest day, MEDIUM if it's approaching, LOW otherwise.
- Consider that the riskiest PERIOD might span multiple days (e.g., "sexta a domingo" for weekend pattern).

Return ONLY valid JSON in this exact format:
{
  "relapseAnalysis": {
    "trigger": "the actual top trigger name",
    "percentage": actual_percentage_number,
    "advice": "a specific, actionable tip related to THAT trigger (2 sentences max)"
  },
  "moodForecast": {
    "prediction": "specific mood prediction based on their pattern",
    "daysToPeak": number_of_days_to_reach_better_state,
    "comparableUserGroup": "personalized description of their progress level"
  },
  "riskRadar": {
    "riskLevel": "LOW or MEDIUM or HIGH based on today being a risky day or not",
    "dayOfWeek": "the actual riskiest day name from the failure distribution data",
    "message": "specific warning or encouragement for today (1-2 sentences)"
  },
  "dailyChallenge": {
    "title": "short challenge title",
    "description": "specific micro-challenge based on their triggers and patterns",
    "id": "unique_challenge_id"
  }
}`;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are an empathetic health coach AI. Return ONLY valid JSON, no markdown, no extra text. Be specific and data-driven.",
                },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content from AI");

        console.log("[AI Insights Debug] AI response received successfully");

        const parsed = JSON.parse(content);
        const sanitized = sanitizeResponse(parsed);
        return NextResponse.json(sanitized);
    } catch (e) {
        console.error("[AI Insights] Error:", e);
        return NextResponse.json(getFallbackInsights());
    }
}

function sanitizeResponse(data: Record<string, unknown>) {
    const fallback = getFallbackInsights();
    return {
        relapseAnalysis: {
            trigger: (data.relapseAnalysis as Record<string, unknown>)?.trigger ?? fallback.relapseAnalysis.trigger,
            percentage: (data.relapseAnalysis as Record<string, unknown>)?.percentage ?? fallback.relapseAnalysis.percentage,
            advice: (data.relapseAnalysis as Record<string, unknown>)?.advice ?? fallback.relapseAnalysis.advice,
        },
        moodForecast: {
            prediction: (data.moodForecast as Record<string, unknown>)?.prediction ?? fallback.moodForecast.prediction,
            daysToPeak: (data.moodForecast as Record<string, unknown>)?.daysToPeak ?? fallback.moodForecast.daysToPeak,
            comparableUserGroup: (data.moodForecast as Record<string, unknown>)?.comparableUserGroup ?? fallback.moodForecast.comparableUserGroup,
        },
        riskRadar: {
            riskLevel: (data.riskRadar as Record<string, unknown>)?.riskLevel ?? fallback.riskRadar.riskLevel,
            dayOfWeek: (data.riskRadar as Record<string, unknown>)?.dayOfWeek ?? fallback.riskRadar.dayOfWeek,
            message: (data.riskRadar as Record<string, unknown>)?.message ?? fallback.riskRadar.message,
        },
        dailyChallenge: {
            title: (data.dailyChallenge as Record<string, unknown>)?.title ?? fallback.dailyChallenge.title,
            description: (data.dailyChallenge as Record<string, unknown>)?.description ?? fallback.dailyChallenge.description,
            id: (data.dailyChallenge as Record<string, unknown>)?.id ?? fallback.dailyChallenge.id,
        },
    };
}

function getFallbackInsights() {
    return {
        relapseAnalysis: {
            trigger: "Dados insuficientes",
            percentage: 0,
            advice: "Continue registrando seu dia para desbloquear análises personalizadas.",
        },
        moodForecast: {
            prediction: "Mais energia",
            daysToPeak: 3,
            comparableUserGroup: "Novos usuários",
        },
        riskRadar: {
            riskLevel: "LOW",
            dayOfWeek: "Hoje",
            message: "Você está indo bem! Continue focado.",
        },
        dailyChallenge: {
            title: "Primeiro Passo",
            description: "Registre seu humor ao longo do dia para ativar insights.",
            id: "challenge_first_log",
        },
    };
}
