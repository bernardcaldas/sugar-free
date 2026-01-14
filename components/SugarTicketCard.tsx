'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ticket, Lock, Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DailyLog } from '@/types'
import { differenceInDays, addDays, format, isSameDay } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar' // Shadcn calendar for selection

interface SugarTicketCardProps {
    currentStreak: number
    logs: DailyLog[]
    onUseTicket: (date: Date) => Promise<boolean>
}

export function SugarTicketCard({ currentStreak, logs, onUseTicket }: SugarTicketCardProps) {
    const [isPlanningOpen, setIsPlanningOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [loading, setLoading] = useState(false)

    // 1. Calculate Phase & Cooldown
    const { phase, cooldownDays, nextAvailableDate, isLocked, isAvailable, lastTicketDate } = useMemo(() => {
        // Find last used ticket
        const ticketLogs = logs.filter(l => l.is_ticket).sort((a, b) => b.date.localeCompare(a.date))
        const lastTicket = ticketLogs[0]
        const lastDate = lastTicket ? new Date(lastTicket.date) : null

        // Determine Phase based on Streak (or maybe total days logic?)
        // Prompt: "Fase 1: 10 dias consecutivos. Fase 2: Consolidação"
        // Let's use currentStreak for Phase 1 check.

        let phase = 'Reset'
        let cooldown = 10

        if (currentStreak < 10 && !lastDate) {
            // Logic: If never used ticket and streak < 10 -> Locked Phase 1
            // If used ticket before, we might be in cooldown.
            phase = 'Reset'
            cooldown = 10
        } else {
            // Phase 2 logic based on frequency
            phase = 'Consolidation'
            // Simple logic:
            // Beginner: < 30 days total history? Or streak?
            // Let's use Streak for level
            if (currentStreak < 30) cooldown = 7
            else if (currentStreak < 90) cooldown = 15
            else cooldown = 30
        }

        // Calculate Availability
        let nextDate = new Date()
        if (phase === 'Reset') {
            // Available after day 10.
            // rough estimation: today + (10 - streak)
            nextDate = addDays(new Date(), 10 - currentStreak)
        } else {
            // Specific cooldown from last usage
            if (lastDate) {
                nextDate = addDays(lastDate, cooldown)
            } else {
                // First ticket ever (after initial 10 days)
                nextDate = new Date() // Available now
            }
        }

        // Ensure we don't say "Available" if we are in Phase 1 rigid lock
        if (currentStreak < 10 && !lastDate) {
            // Overwrite nextDate logic above
            nextDate = addDays(new Date(), 10 - currentStreak)
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        nextDate.setHours(0, 0, 0, 0)

        const isAvailable = today >= nextDate
        const daysUntil = differenceInDays(nextDate, today)

        return { phase, cooldownDays: cooldown, nextAvailableDate: nextDate, isLocked: !isAvailable, isAvailable, lastTicketDate: lastDate }
    }, [currentStreak, logs])

    // Handle Confirm
    const handleConfirm = async () => {
        if (!selectedDate) return
        setLoading(true)
        await onUseTicket(selectedDate)
        setLoading(false)
        setIsPlanningOpen(false)
    }

    return (
        <Card className={cn(
            "border-l-4 transition-all",
            isAvailable
                ? "border-l-amber-400 bg-amber-50/50 dark:bg-amber-900/10"
                : "border-l-gray-300 dark:border-l-gray-700 opacity-90"
        )}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-full", isAvailable ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500")}>
                        {isAvailable ? <Ticket className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <div>
                        <CardTitle className="text-base">Sugar Ticket</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {isAvailable
                                ? "One planned free meal."
                                : isLocked && phase === 'Reset'
                                    ? "Unlocked after 10 consecutive days."
                                    : "Planned flexibility."}
                        </p>
                    </div>
                </div>
                {isLocked && (
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Locked</span>
                        <span className="text-sm font-semibold">{differenceInDays(nextAvailableDate, new Date())} days left</span>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {isAvailable ? (
                    <div className="space-y-3">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            You've earned a flex option. Use it wisely for a single planned occasion.
                        </p>
                        <Button
                            size="sm"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium"
                            onClick={() => setIsPlanningOpen(true)}
                        >
                            <Ticket className="h-4 w-4 mr-2" />
                            Plan My Flex Meal
                        </Button>
                        <p className="text-xs text-center text-muted-foreground italic">
                            "Planning beats impulsive eating."
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            {/* Progress bar */}
                            <div
                                className="h-full bg-gray-400 dark:bg-gray-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, 100 - (differenceInDays(nextAvailableDate, new Date()) / cooldownDays * 100)))}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{lastTicketDate ? "Ticket used." : "Phase 1"}</span>
                            <span>Next: {differenceInDays(nextAvailableDate, new Date())} days</span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground italic pt-1">
                            "Control is choosing, not avoiding forever."
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Planning Dialog */}
            <Dialog open={isPlanningOpen} onOpenChange={setIsPlanningOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Plan Sugar Ticket</DialogTitle>
                        <DialogDescription>
                            Select a date for your planned exception.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-amber-800 dark:text-amber-200 text-sm">
                            <ul className="list-disc pl-4 space-y-1">
                                <li><strong>Single occasion</strong> (not a whole day).</li>
                                <li>Does <strong>not</strong> break your streak.</li>
                                <li>Marked as "Planned" in your history.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <div className="border rounded-md p-2 flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) => date < new Date() && !isSameDay(date, new Date())}
                                    initialFocus
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPlanningOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} disabled={loading || !selectedDate} className="bg-amber-600 hover:bg-amber-700">
                            {loading ? "Confirming..." : "Confirm Flex Meal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
