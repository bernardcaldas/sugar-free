'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { Timeline } from '@/components/Timeline'
import { NextReward } from '@/components/NextReward'
import { SugarTicketCard } from '@/components/SugarTicketCard'
import { calculateStreak } from '@/lib/utils'
import { useMemo, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function JourneyPage() {
    const { user } = useAuth()
    const { logs, fetchLogs, markDay } = useDailyLogs(user?.id)
    const { t } = useLanguage()

    // Ensure logs are fetched
    useEffect(() => {
        if (user) {
            fetchLogs(new Date()) // Fetch for current context
        }
    }, [user, fetchLogs])

    const streak = useMemo(() => calculateStreak(logs), [logs])

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold mb-2">{t('journey.title')}</h1>
                <p className="text-muted-foreground">{t('journey.subtitle')}</p>
            </div>

            {/* Flex Day Card - Sugar Ticket */}
            <section>
                <SugarTicketCard
                    currentStreak={streak}
                    logs={logs}
                    onUseTicket={(date) => markDay(date, false, "Sugar Ticket Used", true)}
                />
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
