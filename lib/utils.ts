import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { DailyLog } from "@/types"
import { differenceInDays, isSameDay } from "date-fns"

export function calculateStreak(logs: DailyLog[]): number {
  if (!logs.length) return 0

  // Sort desc
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if today or yesterday is the start
  const firstLogDate = new Date(sorted[0].date)
  firstLogDate.setHours(0, 0, 0, 0) // Normalize

  // If first log is older than yesterday, streak is broken (0), UNLESS today hasn't been logged yet but yesterday was success.
  // Actually, standard streak: counts consecutive success days going back from today/yesterday.

  // Naive approach: iterate and count consecutive success
  // We need to handle "missing days" as break.

  // Better: check continuity.
  // ... (Simplification for MVP: just count success=true from top, taking gaps into account)

  let current = today
  // If today is logged, start from today. If not, start from yesterday?
  // Let's just iterate logs. If log date == current, good. If log date < current by 1, good. If gap > 1, break.
  // Actually, we need to walk BACKWARDS from today.

  // Map of date string -> success
  const logMap = new Map<string, boolean>()
  logs.forEach(l => logMap.set(l.date, l.success))

  // Check today
  let d = new Date()
  let hasToday = logMap.has(d.toISOString().split('T')[0])
  if (!hasToday) {
    // If today not logged, check yesterday. If yesterday not logged/fail, streak 0.
    d.setDate(d.getDate() - 1)
  }

  while (true) {
    const dateStr = d.toISOString().split('T')[0]
    const log = logs.find(l => l.date === dateStr)

    if (log?.success) {
      streak++
      d.setDate(d.getDate() - 1)
    } else if (log?.is_ticket) {
      // It's a ticket day. Don't increment streak, but don't break it either.
      // Just go back one day.
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function calculateMonthStats(logs: DailyLog[], totalDaysInMonth: number) {
  const successCount = logs.filter(l => l.success).length
  // Ensure we don't divide by zero, though totalDaysInMonth usually 28-31
  const percentage = totalDaysInMonth > 0 ? (successCount / totalDaysInMonth) * 100 : 0
  return Math.round(percentage)
}

