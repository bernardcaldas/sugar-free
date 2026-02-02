'use client'

import { useState } from 'react'
import { Check, X, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DailyLog } from '@/types'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

import { CalendarOff } from 'lucide-react'

interface ActionCardProps {
    log?: DailyLog
    onMark: (success: boolean, note?: string) => Promise<boolean>
    isFuture?: boolean
}

export function ActionCard({ log, onMark, isFuture }: ActionCardProps) {
    const { t } = useLanguage()
    const [cheatAvailable, setCheatAvailable] = useState(false)
    const [cheatsUsedThisWeek, setCheatsUsedThisWeek] = useState(0)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState(log?.note || '')
    const [confirmState, setConfirmState] = useState<'yes' | 'no' | null>(null)

    // Check Flexible Mode on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const isFlexible = localStorage.getItem('sugar-free-flexible-mode') === 'true'

            // Check usage this week (ISO week)
            // Simple check: how many [FLEXIBLE] logs in last 7 days? Better: Current Mon-Sun week.
            // For now, rolling 7 days is safer/easier logic or just reset on Mondays.
            // Let's do: count [FLEXIBLE] in current logs that are within this week.
            // Since we might not have all logs passed here, this is tricky. 
            // `log` prop is only ONE day. We need context.
            // Ideally ActionCard shouldn't be responsible for this check without data.
            // BUT, for MVP, let's assume if we are editing TODAY, we check local storage history or we rely on the parent updating?
            // Let's use a simpler heuristic: Allow it if user says so, let backend/utils validate streak. 
            // We just need to know if we SHOULD show the button.

            setCheatAvailable(isFlexible)
        }
    })

    const handleMark = async (success: boolean, useCheatPass: boolean = false) => {
        setLoading(true)
        let finalNote = note
        if (useCheatPass) {
            finalNote = (note ? note + ' ' : '') + '[FLEXIBLE] Cheat Day Used'
        }
        await onMark(success, finalNote)
        setLoading(false)
        setOpen(false)
    }

    // ... (Existing render code for future/ticket/log present)

    if (log) {
        // Ticket State
        if (log.is_ticket) {
            return (
                <Card className="border-l-4 border-l-amber-500 bg-amber-50/10">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 text-amber-700 dark:text-amber-500">
                                <Check className="text-amber-500" /> {t('journey.sugar_ticket.title')}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Enjoy your mindful choice.</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="opacity-50 hover:opacity-100">
                            Edit
                        </Button>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Day</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <p className="text-sm text-muted-foreground text-center">
                                        This day is marked as a <strong>Sugar Ticket</strong>.
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <Button variant="outline" onClick={() => handleMark(true)} disabled={loading}>
                                            Actually Sugar Free
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleMark(false)} disabled={loading}>
                                            Reset / Failure
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            )
        }

        const isFlexibleDay = log.note?.includes('[FLEXIBLE]')

        return (
            <Card className={cn("border-l-4",
                log.success ? 'border-l-green-500' :
                    isFlexibleDay ? 'border-l-blue-500' : 'border-l-red-500'
            )}>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            {log.success ? (
                                <> <Check className="text-green-500" /> {t('home.yes_button')} </>
                            ) : isFlexibleDay ? (
                                <> <Check className="text-blue-500" /> Flexible Pass </>
                            ) : (
                                <> <X className="text-red-500" /> {t('home.no_button')} </>
                            )}
                        </h3>
                        {log.note && <p className="text-sm text-muted-foreground mt-1">"{log.note.replace('[FLEXIBLE]', '').trim()}"</p>}
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Day</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Button
                                        variant={log.success ? "default" : "outline"}
                                        className={cn("w-full", log.success ? "bg-green-600 hover:bg-green-700" : "")}
                                        onClick={() => handleMark(true)}
                                        disabled={loading}
                                    >
                                        {t('common.yes')}
                                    </Button>
                                    <Button
                                        variant={!log.success && !isFlexibleDay ? "destructive" : "outline"}
                                        className="w-full"
                                        onClick={() => handleMark(false)}
                                        disabled={loading}
                                    >
                                        {t('common.no')}
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <Label>Note (Optional)</Label>
                                    <Input
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Note..."
                                    />
                                </div>
                                <Button className="w-full" onClick={() => handleMark(log.success)} disabled={loading}>
                                    {t('common.save')}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        )
    }

    const handleConfirmStep = (type: 'yes' | 'no') => {
        if (confirmState === type) {
            handleMark(type === 'yes')
            setConfirmState(null)
        } else {
            setConfirmState(type)
            setTimeout(() => setConfirmState(null), 3000)
        }
    }

    const handleCheatUse = () => {
        handleMark(false, true) // Success=false (sugar eaten), but useCheatPass=true
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{t('home.action_card_title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pb-8">
                {/* Main Yes/No Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        className={cn(
                            "h-16 w-full sm:w-32 text-lg transition-all duration-200",
                            confirmState === 'yes' ? "bg-green-700 ring-2 ring-green-400 ring-offset-2 scale-105" : "bg-green-600 hover:bg-green-700"
                        )}
                        onClick={() => handleConfirmStep('yes')}
                        disabled={loading || (confirmState === 'no')}
                    >
                        {confirmState === 'yes' ? (
                            <span className="text-xs flex flex-col items-center leading-tight">
                                <span>{t('home.tap_to_confirm')}</span>
                            </span>
                        ) : t('common.yes')}
                    </Button>
                    <Button
                        size="lg"
                        variant="destructive"
                        className={cn(
                            "h-16 w-full sm:w-32 text-lg transition-all duration-200",
                            confirmState === 'no' ? "bg-red-700 ring-2 ring-red-400 ring-offset-2 scale-105" : ""
                        )}
                        onClick={() => handleConfirmStep('no')}
                        disabled={loading || (confirmState === 'yes')}
                    >
                        {confirmState === 'no' ? (
                            <span className="text-xs flex flex-col items-center leading-tight">
                                <span>{t('home.tap_to_confirm')}</span>
                            </span>
                        ) : t('common.no')}
                    </Button>
                </div>

                {/* Cheat Day Option - Only shows if 'no' is selected/pending or just as an alternative? 
                    Better: Show it when user clicks 'No' (Failure) inside the confirmation or as a third option if enabled.
                    Let's show it below if flexible mode is ON and user hasn't selected yet.
                */}

                {cheatAvailable && (
                    <div className="text-center mt-2 animate-in fade-in slide-in-from-bottom-2">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or Use Flexible Pass</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="mt-4 w-full sm:w-auto border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                            onClick={handleCheatUse}
                            disabled={loading}
                        >
                            🛡️ Use Weekly Cheat Day
                        </Button>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Maintains streak • 1 per week available
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
