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
        <div className="py-2">
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-serif text-foreground">{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full bg-surface-container-low hover:bg-surface-container-high" onClick={() => onMonthChange(subMonths(currentDate, 1))}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full bg-surface-container-low hover:bg-surface-container-high" onClick={() => onMonthChange(addMonths(currentDate, 1))}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-widest mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`${d}-${i}`} className="text-muted-foreground font-black">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {days.map(day => {
                    const log = getLog(day)
                    const isToday = isSameDay(day, new Date())
                    
                    let styleClass = "text-foreground hover:bg-surface-container-lowest"
                    if (log) {
                        if (log.is_ticket) {
                            styleClass = "bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold"
                        } else if (log.success) {
                            styleClass = "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                        } else {
                            styleClass = "bg-destructive/10 text-destructive font-bold" // Flexible pass logic is handled via 'isFlexibleDay' check normally, but generic failure = destructive
                        }
                    } else if (day > new Date()) {
                       styleClass = "text-muted-foreground/30 pointer-events-none"
                    }

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={`
                            h-14 w-full rounded-2xl flex items-center justify-center text-sm transition-all
                            ${styleClass}
                            ${isToday && !log ? "ring-2 ring-primary/30 ring-offset-2" : ""}
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
