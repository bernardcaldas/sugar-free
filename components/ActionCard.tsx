'use client'

import { useState, useEffect } from 'react'
import { Check, X, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DailyLog, MoodType, TriggerType } from '@/types'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

import { CalendarOff } from 'lucide-react'
import { EmotionSelector } from './EmotionSelector'
import { TriggerSelector } from './TriggerSelector'

interface ActionCardProps {
    log?: DailyLog
    onMark: (success: boolean, note?: string, is_ticket?: boolean, mood?: string, trigger?: string) => Promise<boolean>
    isFuture?: boolean
}

export function ActionCard({ log, onMark, isFuture }: ActionCardProps) {
    const { t } = useLanguage()
    const [cheatAvailable, setCheatAvailable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [confirmState, setConfirmState] = useState<'yes' | 'no' | null>(null)

    // New Flow States
    const [showEmotionSelector, setShowEmotionSelector] = useState(false)
    const [showTriggerSelector, setShowTriggerSelector] = useState(false)
    const [pendingTrigger, setPendingTrigger] = useState<string | undefined>(undefined)
    const [isSuccessFlow, setIsSuccessFlow] = useState(true)

    // Check Flexible Mode on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isFlexible = localStorage.getItem('sugar-free-flexible-mode') === 'true'
            setCheatAvailable(isFlexible)
        }
    }, [])

    const handleMark = async (success: boolean, useCheatPass: boolean = false, mood?: string, trigger?: string) => {
        setLoading(true)
        let finalNote = ''
        if (useCheatPass) {
            finalNote = '[FLEXIBLE] Cheat Day Used'
        }

        await onMark(success, finalNote, false, mood, trigger)
        setLoading(false)
        setOpen(false)
        setShowEmotionSelector(false)
        setShowTriggerSelector(false)
        setConfirmState(null)
        setPendingTrigger(undefined)
    }

    const handleSuccessSelection = (mood: string) => {
        handleMark(isSuccessFlow, false, mood, pendingTrigger)
    }

    const handleTriggerSelection = (trigger: string) => {
        setPendingTrigger(trigger)
        setShowTriggerSelector(false)
        setShowEmotionSelector(true) // Sequence: Trigger -> then Mood
    }

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
                                <div className="space-y-4 py-4 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        This day is marked as a <strong>Sugar Ticket</strong>.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" onClick={() => setShowEmotionSelector(true)} disabled={loading}>
                                            Actually Sugar Free
                                        </Button>
                                        <Button variant="destructive" onClick={() => setShowTriggerSelector(true)} disabled={loading}>
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
            <Card className={cn("border-l-4 shadow-sm",
                log.success ? 'border-l-green-500 bg-green-500/5' :
                    isFlexibleDay ? 'border-l-blue-500 bg-blue-500/5' : 'border-l-red-500 bg-red-500/5'
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
                        {/* Display Mood/Trigger badge */}
                        {(log.mood || log.trigger) && (
                            <div className="flex gap-2 mt-1.5">
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                                    log.mood ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                )}>
                                    {log.mood ? `😊 ${log.mood}` : `⚠️ ${log.trigger}`}
                                </span>
                            </div>
                        )}
                        {log.note && !log.note.includes('[FLEXIBLE]') && <p className="text-sm text-muted-foreground mt-1 opacity-70 italic">"{log.note}"</p>}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
                        <Edit2 className="w-3.5 h-3.5" /> {t('common.edit')}
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-center">Modificar Registro</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <p className="text-center text-sm text-muted-foreground">Como foi seu dia alterado?</p>
                                <div className="grid grid-cols-1 gap-3">
                                    <Button
                                        variant="outline"
                                        className="h-14 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/50"
                                        onClick={() => { setIsSuccessFlow(true); setPendingTrigger(undefined); setShowEmotionSelector(true); setOpen(false); }}
                                        disabled={loading}
                                    >
                                        Mudar para: Açúcar Zero
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-14 bg-red-50 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/50"
                                        onClick={() => { setIsSuccessFlow(false); setShowTriggerSelector(true); setOpen(false); }}
                                        disabled={loading}
                                    >
                                        Mudar para: Teve Açúcar
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>

                {/* Selectors */}
                <EmotionSelector
                    open={showEmotionSelector}
                    onOpenChange={setShowEmotionSelector}
                    onSelect={handleSuccessSelection}
                />

                <TriggerSelector
                    open={showTriggerSelector}
                    onOpenChange={setShowTriggerSelector}
                    onSelect={handleTriggerSelection}
                />
            </Card>
        )
    }

    const handleConfirmStep = (type: 'yes' | 'no') => {
        if (confirmState === type) {
            // Second tap - Confirm
            if (type === 'yes') {
                setIsSuccessFlow(true)
                setPendingTrigger(undefined)
                setShowEmotionSelector(true)
            } else {
                setIsSuccessFlow(false)
                setShowTriggerSelector(true)
            }
        } else {
            setConfirmState(type)
            setTimeout(() => setConfirmState(null), 3000)
        }
    }

    const handleCheatUse = () => {
        handleMark(false, true)
    }

    return (
        <>
            <Card className="shadow-lg border-2 border-primary/5">
                <CardHeader>
                    <CardTitle className="text-center">{t('home.action_card_title')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pb-8">
                    {/* Main Yes/No Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            className={cn(
                                "h-20 w-full sm:w-36 text-xl font-bold transition-all duration-300",
                                confirmState === 'yes' ? "bg-green-700 ring-4 ring-green-400/30 ring-offset-2 scale-105" : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                            )}
                            onClick={() => handleConfirmStep('yes')}
                            disabled={loading || (confirmState === 'no')}
                        >
                            {confirmState === 'yes' ? (
                                <span className="text-[10px] uppercase tracking-tighter leading-none flex flex-col items-center">
                                    <span>{t('home.tap_to_confirm')}</span>
                                    <span className="text-lg mt-1">{t('home.action_card.yes_emphatic')}</span>
                                </span>
                            ) : t('common.yes')}
                        </Button>
                        <Button
                            size="lg"
                            variant="destructive"
                            className={cn(
                                "h-20 w-full sm:w-36 text-xl font-bold transition-all duration-300",
                                confirmState === 'no' ? "bg-red-700 ring-4 ring-red-400/30 ring-offset-2 scale-105" : "shadow-lg shadow-red-500/20"
                            )}
                            onClick={() => handleConfirmStep('no')}
                            disabled={loading || (confirmState === 'yes')}
                        >
                            {confirmState === 'no' ? (
                                <span className="text-[10px] uppercase tracking-tighter leading-none flex flex-col items-center">
                                    <span>{t('home.tap_to_confirm')}</span>
                                    <span className="text-lg mt-1">{t('home.action_card.restricted')}</span>
                                </span>
                            ) : t('common.no')}
                        </Button>
                    </div>

                    {cheatAvailable && (
                        <div className="text-center mt-4 pt-4 border-t border-dashed animate-in fade-in slide-in-from-bottom-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                                ⚖️ {t('home.action_card.flexible_mode')}
                            </p>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 rounded-xl px-8"
                                onClick={handleCheatUse}
                                disabled={loading}
                            >
                                🛡️ {t('home.action_card.use_pass')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <EmotionSelector
                open={showEmotionSelector}
                onOpenChange={setShowEmotionSelector}
                onSelect={handleSuccessSelection}
            />

            <TriggerSelector
                open={showTriggerSelector}
                onOpenChange={setShowTriggerSelector}
                onSelect={handleTriggerSelection}
            />
        </>
    )
}
