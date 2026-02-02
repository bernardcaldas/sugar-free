import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { DailyLog } from "@/types"
import { differenceInDays, isSameDay } from "date-fns"

export function parseLocalDate(dateStr: string) {
  if (!dateStr) return new Date()
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function calculateStreak(logs: DailyLog[]): number {
  if (!logs.length) return 0

  // Sort desc
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if today or yesterday is the start
  const firstLogDate = parseLocalDate(sorted[0].date)
  firstLogDate.setHours(0, 0, 0, 0) // Normalize

  // ... (Simplification for MVP: just count success=true from top, taking gaps into account)

  let current = today

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

    // Check for success OR flexible pass
    const isSuccess = log?.success
    const isFlexible = log?.note?.includes('[FLEXIBLE]')
    const isTicket = log?.is_ticket

    if (isSuccess || isFlexible) {
      streak++
      d.setDate(d.getDate() - 1)
    } else if (isTicket) {
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
