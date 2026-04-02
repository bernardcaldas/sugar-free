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
        <div className="space-y-12 pb-24 pt-4 px-2 sm:px-4">
            {process.env.NODE_ENV === 'development' && <DebugTrophySeeder />}
            <div className="text-center md:text-left px-2">
                <h1 className="text-4xl font-serif font-black tracking-tight text-foreground mb-3">{t('journey.title')}</h1>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{t('journey.subtitle')}</p>
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
            <section className="bg-surface-container-low text-foreground rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-lg shadow-black/5">
                <div className="space-y-1 pr-4">
                    <Label className="text-lg font-black">Flexible Mode</Label>
                    <p className="text-xs text-muted-foreground font-medium">Allows 1 cheat day per week without breaking streak.</p>
                    <span className={`inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${flexibleMode ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {flexibleMode ? 'Active' : 'Disabled'}
                    </span>
                </div>
                <div>
                    <Switch checked={flexibleMode} onCheckedChange={toggleFlexibleMode} className="scale-125" />
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
