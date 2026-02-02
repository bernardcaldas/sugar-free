'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ticket, Lock, Clock, Check } from 'lucide-react'
import { cn, parseLocalDate } from '@/lib/utils'
import { DailyLog } from '@/types'
import { differenceInDays, addDays, format, isSameDay } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar' // Shadcn calendar for selection

interface SugarTicketCardProps {
    currentStreak: number
    logs: DailyLog[]
    onUseTicket: (date: Date) => Promise<boolean>
    ticketsAvailable: number
    nextTicketIn: number
}

import { useLanguage } from '@/contexts/LanguageContext'

// ... imports

export function SugarTicketCard({ currentStreak, logs, onUseTicket, ticketsAvailable, nextTicketIn }: SugarTicketCardProps) {
    const { t } = useLanguage()
    const [isPlanningOpen, setIsPlanningOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [loading, setLoading] = useState(false)

    const isAvailable = ticketsAvailable > 0
    const isLocked = !isAvailable

    // Cooldown is now fixed 10 days logic from parent
    const cooldownDays = 10

    // Calculate progress for bar
    // If next ticket in 3 days, progress is 7/10 = 70%
    const progress = Math.min(100, Math.max(0, ((10 - nextTicketIn) / 10) * 100))

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
                        <CardTitle className="text-base">{t('journey.sugar_ticket.title')}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {isAvailable
                                ? "Available for use"
                                : "Earned every 10 log days"}
                        </p>
                    </div>
                </div>
                {isLocked && (
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Locked</span>
                        <span className="text-sm font-semibold">{nextTicketIn} {t('journey.next_reward.days_left')}</span>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {isAvailable ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg">
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Inventory:
                            </span>
                            <span className="text-lg font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1">
                                <Ticket className="w-4 h-4" /> x{ticketsAvailable}
                            </span>
                        </div>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            {t('journey.sugar_ticket.context_available')}
                        </p>
                        <Button
                            size="sm"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium"
                            onClick={() => setIsPlanningOpen(true)}
                        >
                            <Ticket className="h-4 w-4 mr-2" />
                            {t('journey.sugar_ticket.plan_button')}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            {/* Progress bar */}
                            <div
                                className="h-full bg-gray-400 dark:bg-gray-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Progress to Next Ticket</span>
                            <span>{nextTicketIn} days left</span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground italic pt-1">
                            {t('journey.sugar_ticket.quote_control')}
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Planning Dialog */}
            <Dialog open={isPlanningOpen} onOpenChange={setIsPlanningOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('journey.sugar_ticket.dialog_title')}</DialogTitle>
                        <DialogDescription>
                            {t('journey.sugar_ticket.dialog_desc')}
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
                            <label className="text-sm font-medium">{t('journey.sugar_ticket.dialog_desc')}</label>
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
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handleConfirm} disabled={loading || !selectedDate} className="bg-amber-600 hover:bg-amber-700">
                            {loading ? t('common.loading') : t('common.confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
