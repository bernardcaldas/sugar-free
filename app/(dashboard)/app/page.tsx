'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { ActionCard } from '@/components/ActionCard'
import { StatsCard } from '@/components/StatsCard'
import { Calendar } from '@/components/Calendar'
import { Motivation } from '@/components/Motivation'
import { SOSModule } from '@/components/SOSModule'
import { MonthlyRecap } from '@/components/MonthlyRecap'
import { DebugSeeder } from '@/components/DebugSeeder'
import { calculateStreak, calculateMonthStats, parseLocalDate } from '@/lib/utils'
import { useState, useEffect, useMemo } from 'react'
import { format, isSameDay, getDaysInMonth } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardPage() {
    const { user } = useAuth()
    const { logs, loading: logsLoading, fetchLogs, markDay } = useDailyLogs(user?.id)
    const { t } = useLanguage()

    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // Fetch logs when user or month changes
    useEffect(() => {
        if (user) {
            fetchLogs(currentMonth)
        }
    }, [user, currentMonth, fetchLogs])

    // Get current day log
    const today = useMemo(() => new Date(), [])
    const todayLog = useMemo(() => {
        return logs.find(l => isSameDay(parseLocalDate(l.date), today))
    }, [logs, today])

    // Calculate stats
    const streak = useMemo(() => calculateStreak(logs), [logs])
    const monthPercentage = useMemo(() => {
        return calculateMonthStats(logs, getDaysInMonth(currentMonth))
    }, [logs, currentMonth])

    // Handle Mark
    const handleMark = async (date: Date, success: boolean, note?: string, is_ticket?: boolean, mood?: string, trigger?: string) => {
        await markDay(date, success, note, is_ticket, mood, trigger)
        if (selectedDate) setSelectedDate(null) // Close modal if open
        return true
    }

    // Selected log for Modal
    const selectedLog = useMemo(() => {
        if (!selectedDate) return undefined
        return logs.find(l => isSameDay(new Date(l.date), selectedDate))
    }, [logs, selectedDate])

    return (
        <div className="space-y-6 pb-10">
            <MonthlyRecap userId={user?.id} />
            {process.env.NODE_ENV === 'development' && <DebugSeeder />}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-full lg:col-span-4 space-y-6 min-w-0">
                    {/* Today's Action */}
                    <section className="space-y-6">
                        <SOSModule onComplete={() => handleMark(new Date(), true, "SOS_COMPLETED")} />

                        <div>
                            <h2 className="text-lg font-semibold mb-2">{t('home.today_title')}</h2>
                            <ActionCard
                                log={todayLog}
                                onMark={(s, n) => handleMark(today, s, n)}
                                isFuture={false}
                            />
                            <Motivation streakActive={streak > 0} />
                        </div>
                    </section>

                    {/* Stats */}
                    <section>
                        <StatsCard streak={streak} percentage={monthPercentage} />
                    </section>
                </div>

                <div className="col-span-full lg:col-span-3">
                    {/* Calendar */}
                    <section>
                        <h2 className="text-lg font-semibold mb-2">{t('home.history_title')}</h2>
                        <Calendar
                            logs={logs}
                            currentDate={currentMonth}
                            onMonthChange={setCurrentMonth}
                            onDayClick={setSelectedDate}
                        />
                    </section>
                </div>
            </div>

            {/* Edit Modal for History */}
            <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDate ? format(selectedDate, 'MMMM do, yyyy') : 'Edit Day'}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedDate && (
                        <ActionCard
                            log={selectedLog}
                            onMark={(s, n, t, m, tr) => handleMark(selectedDate, s, n, t, m, tr)}
                            isFuture={isSameDay(selectedDate, today) ? false : selectedDate > today}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
