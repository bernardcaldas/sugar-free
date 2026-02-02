'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PartyPopper, Share2, CalendarCheck } from 'lucide-react'
import { DailyLog } from '@/types'
import { calculateMonthStats } from '@/lib/utils'
import { getDaysInMonth, subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import confetti from 'canvas-confetti'

interface MonthlyRecapProps {
    logs: DailyLog[]
}

export function MonthlyRecap({ logs }: MonthlyRecapProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [stats, setStats] = useState<{ percentage: number; totalDays: number; monthName: string }>({ percentage: 0, totalDays: 0, monthName: '' })

    useEffect(() => {
        // Check local storage for last seen month
        const lastSeenMonth = localStorage.getItem('lastSeenMonthRecap')
        const currentMonthKey = format(new Date(), 'yyyy-MM')

        // If we haven't seen this month's recap AND it is not the very first month of usage (simple check: valid logs exist from prev month)
        // For prototype: Just check if we haven't seen it for *this* current month period roughly.
        // Actually, we want to show it ONCE when we enter a new month.

        if (lastSeenMonth !== currentMonthKey) {
            // Calculate previous month stats
            const prevMonthDate = subMonths(new Date(), 1)
            const daysInPrevMonth = getDaysInMonth(prevMonthDate)

            // Filter logs for previous month
            const start = startOfMonth(prevMonthDate)
            const end = endOfMonth(prevMonthDate)

            const prevMonthLogs = logs.filter(log => {
                const logDate = new Date(log.date) // Assuming ISO format YYYY-MM-DD
                // Need to parse correctly if it includes time, but usually YYYY-MM-DD
                // Safe parsing:
                const d = new Date(log.date + 'T00:00:00')
                return isWithinInterval(d, { start, end })
            })

            if (prevMonthLogs.length > 0) {
                const successCount = prevMonthLogs.filter(l => l.success).length
                const percentage = Math.round((successCount / daysInPrevMonth) * 100)

                setStats({
                    percentage,
                    totalDays: successCount,
                    monthName: format(prevMonthDate, 'MMMM')
                })

                // Show modal
                setIsOpen(true)
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            }
        }
    }, [logs])

    const handleClose = () => {
        const currentMonthKey = format(new Date(), 'yyyy-MM')
        localStorage.setItem('lastSeenMonthRecap', currentMonthKey)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mb-2">
                        <PartyPopper className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {stats.monthName} Unlocked! 🎉
                    </DialogTitle>
                    <DialogDescription className="text-lg">
                        You crushed it last month!
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="bg-secondary/50 p-4 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{stats.percentage}%</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Success Rate</span>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{stats.totalDays}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sugar-Free Days</span>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
                    <p className="font-semibold flex items-center justify-center gap-2">
                        <CalendarCheck className="w-4 h-4" />
                        History Made
                    </p>
                    <p className="opacity-90 mt-1">
                        These stats are now permanently saved in your Lifetime History.
                    </p>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button className="w-full h-12 text-lg" onClick={handleClose}>
                        Let's Conquer {format(new Date(), 'MMMM')}!
                    </Button>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                        <Share2 className="w-4 h-4 mr-2" /> Share Victory
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
