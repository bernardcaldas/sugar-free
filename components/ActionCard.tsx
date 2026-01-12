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

import { CalendarOff } from 'lucide-react'

interface ActionCardProps {
    log?: DailyLog
    onMark: (success: boolean, note?: string) => Promise<boolean>
    isFuture?: boolean
}

export function ActionCard({ log, onMark, isFuture }: ActionCardProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState(log?.note || '')

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
        return (
            <Card className={`border-l-4 ${log.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            {log.success ? (
                                <> <Check className="text-green-500" /> Sugar Free Day! </>
                            ) : (
                                <> <X className="text-red-500" /> Sugar Consumed </>
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
                                        Sugar Free
                                    </Button>
                                    <Button
                                        variant={!log.success ? "destructive" : "outline"}
                                        className="w-full"
                                        onClick={() => handleMark(false)}
                                        disabled={loading}
                                    >
                                        Consumed Sugar
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <Label>Note (Optional)</Label>
                                    <Input
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Was it a cake? Or did you resist?"
                                    />
                                </div>
                                <Button className="w-full" onClick={() => handleMark(log.success)} disabled={loading}>
                                    Update Note
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        )
    }

    // Not logged yet
    const [confirmState, setConfirmState] = useState<'yes' | 'no' | null>(null)

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
                <CardTitle className="text-center">Did you stay sugar-free today?</CardTitle>
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
                            <span>Tap again</span>
                            <span>to confirm</span>
                        </span>
                    ) : "Yes!"}
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
                            <span>Tap again</span>
                            <span>to confirm</span>
                        </span>
                    ) : "No"}
                </Button>
            </CardContent>
        </Card>
    )
}
