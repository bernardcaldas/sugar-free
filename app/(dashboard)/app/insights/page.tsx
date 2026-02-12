"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RelapseAnalysisCard } from "@/components/insights/RelapseAnalysisCard";
import { MoodForecastCard } from "@/components/insights/MoodForecastCard";
import { RiskRadarCard } from "@/components/insights/RiskRadarCard";
import { DailyChallengeCard } from "@/components/insights/DailyChallengeCard";
import { Sparkles, Loader2, RefreshCw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsights {
    relapseAnalysis: {
        trigger: string;
        percentage: number;
        advice: string;
    } | null;
    moodForecast: {
        prediction: string;
        daysToPeak: number;
        comparableUserGroup: string;
    } | null;
    riskRadar: {
        riskLevel: "LOW" | "MEDIUM" | "HIGH";
        dayOfWeek: string;
        message: string;
    } | null;
    dailyChallenge: {
        title: string;
        description: string;
        id: string;
    } | null;
}

export default function InsightsPage() {
    const { user } = useAuth();
    const [insights, setInsights] = useState<AIInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInsights = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });

            if (!res.ok) throw new Error("Failed to fetch insights");

            const data = await res.json();
            setInsights(data);
        } catch (err) {
            console.error(err);
            setError("Não foi possível carregar os insights. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchInsights();
    }, [fetchInsights]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-400/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative p-4 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 rounded-2xl">
                        <Brain className="h-8 w-8 text-violet-600 dark:text-violet-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Analisando seus dados...</p>
                    <p className="text-xs text-gray-400">IA processando seu histórico</p>
                </div>
                <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchInsights} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Tentar novamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-violet-500" />
                        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                            AI Insights
                        </span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sua inteligência pessoal para vencer o açúcar
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchInsights}
                    disabled={loading}
                    className="rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/30"
                >
                    <RefreshCw className={`h-4 w-4 text-violet-500 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
                <RiskRadarCard data={insights?.riskRadar ?? null} />
                <MoodForecastCard data={insights?.moodForecast ?? null} />
                <RelapseAnalysisCard data={insights?.relapseAnalysis ?? null} />
                <DailyChallengeCard data={insights?.dailyChallenge ?? null} />
            </div>

            <div className="text-center text-[10px] text-muted-foreground pt-4 uppercase tracking-wider font-medium">
                ✨ Análise gerada por IA com base no seu histórico
            </div>
        </div>
    );
}
