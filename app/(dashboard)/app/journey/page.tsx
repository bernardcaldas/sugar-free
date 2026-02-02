'use client'

import { XPBar } from '@/components/XPBar'
import { TrophyRoom } from '@/components/TrophyRoom'
import { useGameMechanics } from '@/hooks/useGameMechanics'
import { useMonthlyHistory } from '@/hooks/useMonthlyHistory'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { Timeline } from '@/components/Timeline'
import { NextReward } from '@/components/NextReward'
import { SugarTicketCard } from '@/components/SugarTicketCard'
import { calculateStreak } from '@/lib/utils'
import { useMemo, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { DebugTrophySeeder } from '@/components/DebugTrophySeeder'

export default function JourneyPage() {
    const { user } = useAuth()
    const { logs, fetchLogs, fetchAllLogs, markDay } = useDailyLogs(user?.id)
    const { t } = useLanguage()

    // Game Mechanics
    const { xp, level, nextLevelXP, levelProgress, ticketsAvailable, nextTicketIn } = useGameMechanics(logs)
    const history = useMonthlyHistory(logs)

    // Ensure logs are fetched
    useEffect(() => {
        if (user) {
            // Fetch ALL logs for history/trophies
            fetchAllLogs()
        }
    }, [user, fetchAllLogs])

    // Fetch full history effect override? 
    // Just for prototype, let's stick to simple fetch. 
    // Ideally we'd modify useDailyLogs to fetch "all since start".

    // Let's add an explicit fetch for history if logs are empty?
    // Or just modify fetchLogs to grab year-to-date?

    const streak = useMemo(() => calculateStreak(logs), [logs])



    return (
        <div className="space-y-6 pb-10">
            {process.env.NODE_ENV === 'development' && <DebugTrophySeeder />}
            <div>
                <h1 className="text-2xl font-bold mb-2">{t('journey.title')}</h1>
                <p className="text-muted-foreground">{t('journey.subtitle')}</p>
            </div>

            {/* XP Section */}
            <section>
                <XPBar
                    level={level}
                    xp={xp}
                    nextLevelXP={nextLevelXP}
                    progress={levelProgress}
                />
            </section>

            {/* Trophy Room (Wall of Fame) */}
            <section>
                <TrophyRoom history={history} />
            </section>

            {/* Flex Day Card - Sugar Ticket */}
            <section>
                <SugarTicketCard
                    currentStreak={streak}
                    logs={logs}
                    onUseTicket={(date) => markDay(date, false, "Sugar Ticket Used", true)}
                    ticketsAvailable={ticketsAvailable}
                    nextTicketIn={nextTicketIn}
                />
            </section>

            {/* Flexible Mode Setting (Mock) */}
            <section className="bg-card border rounded-xl p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Flexible Mode (Weekly Cheat Day)</Label>
                    <p className="text-xs text-muted-foreground">Allows 1 cheat day per week without breaking streak.</p>
                </div>
                <Switch disabled checked={false} onCheckedChange={() => { }} title="Coming soon with logic" />
            </section>

            {/* Next Reward */}
            <section>
                <NextReward currentStreak={streak} />
            </section>

            {/* Timeline */}
            <section>
                <Timeline currentStreak={streak} />
            </section>
        </div>
    )
}
