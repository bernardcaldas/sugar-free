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
        <div className={cn(
            "rounded-3xl p-6 transition-all duration-500",
            isAvailable
                ? "bg-amber-500/10 dark:bg-amber-900/20"
                : "bg-surface-container-low"
        )}>
            <div className="flex flex-row items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={cn("flex items-center justify-center h-14 w-14 rounded-2xl", isAvailable ? "bg-amber-500/20 text-amber-600" : "bg-muted text-muted-foreground")}>
                        {isAvailable ? <Ticket className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black tracking-tight text-foreground">{t('journey.sugar_ticket.title')}</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">
                            {isAvailable
                                ? "Available for use"
                                : "Earned every 10 log days"}
                        </p>
                    </div>
                </div>
                {isLocked && (
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-muted px-2 py-1 rounded-full mb-1">Locked</span>
                    </div>
                )}
            </div>

            <div>
                {isAvailable ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-amber-500/10 p-4 rounded-2xl">
                            <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-200">
                                Inventory
                            </span>
                            <span className="text-3xl font-black text-amber-600 dark:text-amber-300 flex items-center gap-2 tracking-tighter">
                                <Ticket className="w-5 h-5 opacity-50" /> x{ticketsAvailable}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200/70">
                            {t('journey.sugar_ticket.context_available')}
                        </p>
                        <Button
                            size="lg"
                            className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg tracking-wide shadow-lg shadow-amber-500/20"
                            onClick={() => setIsPlanningOpen(true)}
                        >
                            <Ticket className="h-5 w-5 mr-2" />
                            {t('journey.sugar_ticket.plan_button')}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-4">
                           <span className="text-5xl font-black text-foreground tracking-tighter">{10 - nextTicketIn}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">/ 10 Days Progress</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
                            {/* Progress bar */}
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-1000 min-w-[5%]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-center text-muted-foreground pt-2">
                            {t('journey.sugar_ticket.quote_control')}
                        </p>
                    </div>
                )}
            </div>

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
        </div>
    )
}
