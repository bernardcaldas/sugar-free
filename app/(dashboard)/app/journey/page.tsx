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
import { useMemo, useEffect, useState } from 'react'
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

    // Flexible Mode State
    const [flexibleMode, setFlexibleMode] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sugar-free-flexible-mode')
            setFlexibleMode(stored === 'true')
        }
    }, [])

    const toggleFlexibleMode = (checked: boolean) => {
        setFlexibleMode(checked)
        localStorage.setItem('sugar-free-flexible-mode', checked.toString())
    }



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

            {/* Flexible Mode Setting */}
            <section className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:bg-card/80 transition-colors">
                <div className="space-y-1">
                    <Label className="text-lg font-bold">Flexible Mode</Label>
                    <p className="text-sm text-muted-foreground">Allows 1 cheat day per week without breaking streak.</p>
                </div>
                <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${flexibleMode ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                        {flexibleMode ? 'Active' : 'Disabled'}
                    </span>
                    <Switch checked={flexibleMode} onCheckedChange={toggleFlexibleMode} />
                </div>
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
