import { useMemo } from 'react'
import { DailyLog } from '@/types'
import { startOfMonth, endOfMonth, format, isBefore, eachMonthOfInterval, parseISO } from 'date-fns'
import { calculateBadge, BadgeType } from '@/lib/gamification'

export interface MonthStat {
    monthKey: string // YYYY-MM
    monthName: string // Full Month Name
    year: string
    totalDays: number
    successDays: number
    percentage: number
    badge: BadgeType
    isCurrentMonth: boolean
}

export function useMonthlyHistory(logs: DailyLog[]) {
    return useMemo(() => {
        if (logs.length === 0) return []

        // Find range of logs
        const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date))
        const firstLogDate = parseISO(sortedLogs[0].date)
        const now = new Date()
        const start = startOfMonth(firstLogDate)
        const end = endOfMonth(now)

        // Generate all months in range
        const months = eachMonthOfInterval({ start, end })

        const stats: MonthStat[] = months.map(month => {
            const monthStart = startOfMonth(month)
            const monthEnd = endOfMonth(month)
            const monthKey = format(month, 'yyyy-MM')
            const isCurrentMonth = monthKey === format(now, 'yyyy-MM')

            // Get logs for this month
            // Note: date string comparison works for YYYY-MM-DD
            const monthLogs = logs.filter(log => {
                return log.date.startsWith(monthKey)
            })

            const totalDaysInMonth = monthEnd.getDate() // Last day of month is total days
            // Limit total days for current month to "today" if we want strictly "passed" days? 
            // Better: use effective days. But for badge, we usually look at closed months.
            // For current month, we can show "In Progress".

            // For past months, success rate is success / total days in month
            // What if user joined mid-month? We'll punish them slightly or just start from first log?
            // "Sugar Free" philosophy: Every day counts. Using standard calendar month.

            const successDays = monthLogs.filter(l => l.success).length

            // If it's current month, maybe don't calculate badge yet? 
            // Or calculate "current pace".
            // Let's use standard calc.

            const percentage = Math.round((successDays / totalDaysInMonth) * 100)
            const badge = calculateBadge(percentage)

            return {
                monthKey,
                monthName: format(month, 'MMMM'),
                year: format(month, 'yyyy'),
                totalDays: totalDaysInMonth,
                successDays,
                percentage,
                badge: isCurrentMonth ? 'NONE' : badge, // Only award badges for past months
                isCurrentMonth
            }
        })

        // Return reversed (newest first)
        return stats.reverse()
    }, [logs])
}
