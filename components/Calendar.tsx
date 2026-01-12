'use client'

import { DailyLog } from '@/types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CalendarProps {
    logs: DailyLog[]
    currentDate: Date
    onMonthChange: (date: Date) => void
    onDayClick: (date: Date) => void
}

export function Calendar({ logs, currentDate, onMonthChange, onDayClick }: CalendarProps) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Fill empty slots for grid alignment (start of week)
    const startDay = monthStart.getDay() // 0 = Sunday
    const blanks = Array(startDay).fill(null)

    const getLog = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return logs.find(l => l.date === dateStr)
    }

    return (
        <div className="bg-white dark:bg-gray-950 rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onMonthChange(subMonths(currentDate, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onMonthChange(addMonths(currentDate, 1))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`${d}-${i}`} className="text-muted-foreground font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {days.map(day => {
                    const log = getLog(day)
                    const isToday = isSameDay(day, new Date())
                    let bgClass = "bg-gray-100 dark:bg-gray-800"
                    if (log) {
                        bgClass = log.success ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                    }

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={`
                            h-10 w-full rounded-md flex items-center justify-center text-sm border
                            ${bgClass}
                            ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
                            hover:opacity-80 transition-opacity
                        `}
                        >
                            {format(day, 'd')}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
