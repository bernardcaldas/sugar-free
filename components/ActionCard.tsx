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
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState(log?.note || '')
    const [confirmState, setConfirmState] = useState<'yes' | 'no' | null>(null)

    const handleMark = async (success: boolean) => {
        setLoading(true)
        await onMark(success, note)
        setLoading(false)
        setOpen(false)
    }

    if (isFuture) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-4 text-muted-foreground">
                    <CalendarOff className="h-10 w-10" />
                    <div>
                        <h3 className="font-semibold text-lg">Coming Soon</h3>
                        <p className="text-sm">You can't log progress for the future.<br />Focus on today!</p>
                    </div>
                </CardContent>
            </Card>
        )
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
                        {/* Edit button logic can remain or be customized */}
                        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="opacity-50 hover:opacity-100">
                            Edit
                        </Button>

                        {/* Dialog for conversion/undo if needed, re-using existing dialog logic below logic structure if convenient, 
                             but here simpler to just allow re-opening standard dialog to "Undo" or change */}
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
                                        {/* Allow reverting to standard Logging */}
                                        <Button
                                            variant="outline"
                                            onClick={() => handleMark(true)}
                                            disabled={loading}
                                        >
                                            Actually Sugar Free
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleMark(false)}
                                            disabled={loading}
                                        >
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

        return (
            <Card className={`border-l-4 ${log.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            {log.success ? (
                                <> <Check className="text-green-500" /> {t('home.yes_button')} </>
                            ) : (
                                <> <X className="text-red-500" /> {t('home.no_button')} </>
                            )}
                        </h3>
                        {log.note && <p className="text-sm text-gray-500 mt-1">"{log.note}"</p>}
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
                                        variant={!log.success ? "destructive" : "outline"}
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
            // Second tap - Confirm
            handleMark(type === 'yes')
            setConfirmState(null)
        } else {
            // First tap - Wait for config
            setConfirmState(type)
            // Auto reset after 3 seconds
            setTimeout(() => setConfirmState(null), 3000)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{t('home.action_card_title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
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
            </CardContent>
        </Card>
    )
}
