import { DailyLog } from '@/types'
import { calculateStreak } from '@/lib/utils'

// XP Constants
export const XP_PER_DAY = 100
export const XP_PER_SOS = 50
export const XP_PER_STREAK_BONUS = 20

// Level Constants
export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    1000,   // Level 2
    2500,   // Level 3
    5000,   // Level 4
    10000,  // Level 5
    20000,  // Level 6
    35000,  // Level 7
    55000,  // Level 8
    80000,  // Level 9
    110000  // Level 10
]

export const TICKET_COOLDOWN_DAYS = 10

export function calculateXP(logs: DailyLog[]): number {
    let xp = 0

    logs.forEach(log => {
        if (log.success) {
            xp += XP_PER_DAY
            // Check for streak bonus logic if needed, but for now flat rate + manual bonuses
            // If we had streak info per day, we could add bonus.
            // Simplify: Just base XP for now.
        }

        // Check notes for SOS or other bonuses if we store them there
        if (log.note?.includes('SOS_COMPLETED')) {
            xp += XP_PER_SOS
        }
    })

    // Add streak bonus based on current streak
    // This is a dynamic bonus: longer streak = more implicit XP "aura" or just one-time rewards?
    // Spec says "Login consecutive (Streak diário): +20 XP".
    // Assuming this is applied daily. If we don't have login logs, we can estimate from continuous dates.
    // For MVP, let's stick to the log-based calculation.

    return xp
}

export function calculateLevel(xp: number): { level: number; nextLevelXP: number; progress: number } {
    let level = 1
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1
        } else {
            break
        }
    }

    const currentLevelXP = LEVEL_THRESHOLDS[level - 1]
    const nextLevelXP = LEVEL_THRESHOLDS[level] || (currentLevelXP * 1.5) // Fallback for max level
    const progress = Math.min(100, Math.max(0, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100))

    return { level, nextLevelXP, progress }
}

export function calculateTickets(logs: DailyLog[]): { available: number; nextTicketIn: number } {
    // Logic: 1 Ticket earned every 10 consecutive days.
    // We need to look at the history of streaks.
    // This is complex to calculate retroactively from just a list of logs without saving "Ticket Earned" events.
    // SIMPLIFICATION for MVP:
    // Calculate total "clean days" in valid streaks / 10 = Total Tickets Earned.
    // Count total "Ticket Used" logs.
    // Available = Earned - Used.

    // Refined Logic to respect "Consecutive":
    // Iterate through logs sorted by date. Count streak groups.
    // For every 10 days in a streak group, +1 Ticket.

    const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date))
    let currentStreak = 0
    let totalTicketsEarned = 0
    let ticketsUsed = 0

    sortedLogs.forEach((log) => {
        if (log.is_ticket) {
            ticketsUsed++
            // Ticket maintains streak, so streak continues
            currentStreak++
        } else if (log.success) {
            currentStreak++
        } else {
            // Break streak
            currentStreak = 0
        }

        if (currentStreak > 0 && currentStreak % 10 === 0) {
            totalTicketsEarned++
        }
    })

    const available = Math.max(0, totalTicketsEarned - ticketsUsed)
    const daysToNext = 10 - (currentStreak % 10)

    return { available, nextTicketIn: daysToNext }
}

export type BadgeType = 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE'

export function calculateBadge(percentage: number): BadgeType {
    if (percentage >= 90) return 'GOLD'
    if (percentage >= 75) return 'SILVER'
    if (percentage >= 50) return 'BRONZE'
    return 'NONE'
}
