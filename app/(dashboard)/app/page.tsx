'use client'

import { useAuth } from '@/hooks/useAuth'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { ActionCard } from '@/components/ActionCard'
import { StatsCard } from '@/components/StatsCard'
import { Calendar } from '@/components/Calendar'
import { Timeline } from '@/components/Timeline'
import { NextReward } from '@/components/NextReward'
import { Motivation } from '@/components/Motivation'
import { calculateStreak, calculateMonthStats } from '@/lib/utils'
import { useState, useEffect, useMemo } from 'react'
import { format, isSameDay, getDaysInMonth } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DailyLog } from '@/types'

export default function DashboardPage() {
    const { user } = useAuth()
    const { logs, loading: logsLoading, fetchLogs, markDay } = useDailyLogs(user?.id)

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
        return logs.find(l => isSameDay(new Date(l.date), today))
    }, [logs, today])

    // Calculate stats
    const streak = useMemo(() => calculateStreak(logs), [logs])
    const monthPercentage = useMemo(() => {
        return calculateMonthStats(logs, getDaysInMonth(currentMonth))
    }, [logs, currentMonth])

    // Handle Mark
    const handleMark = async (date: Date, success: boolean, note?: string) => {
        await markDay(date, success, note)
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-full lg:col-span-4 space-y-6 min-w-0">
                    {/* Today's Action */}
                    <section>
                        <h2 className="text-lg font-semibold mb-2">Today</h2>
                        <ActionCard
                            log={todayLog}
                            onMark={(s, n) => handleMark(today, s, n)}
                            isFuture={false}
                        />
                        <Motivation streakActive={streak > 0} />
                    </section>

                    {/* Stats */}
                    <section>
                        <StatsCard streak={streak} percentage={monthPercentage} />
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

                <div className="col-span-full lg:col-span-3">
                    {/* Calendar */}
                    <section>
                        <h2 className="text-lg font-semibold mb-2">History</h2>
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
                            onMark={(s, n) => handleMark(selectedDate, s, n)}
                            isFuture={isSameDay(selectedDate, today) ? false : selectedDate > today}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
