'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ShieldAlert, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { useLanguage } from '@/contexts/LanguageContext'

interface SOSModuleProps {
    onComplete: () => void
}

const MOTIVATIONAL_MESSAGES = [
    "Breathe, you can do this.",
    "The craving will pass in minutes.",
    "Think about your goal.",
    "Drink a glass of water.",
    "You are stronger than sugar.",
    "Visualizing your healthy self...",
    "Hold on, almost there!",
    "Distract yourself for a moment.",
    "Your streak is worth it.",
    "Victory is close!"
]

export function SOSModule({ onComplete }: SOSModuleProps) {
    const { t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [timer, setTimer] = useState(300) // 5 minutes
    const [isActive, setIsActive] = useState(false)
    const [messageIndex, setMessageIndex] = useState(0)

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
                // Change message every 30 seconds
                if (timer % 30 === 0) {
                    setMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length)
                }
            }, 1000)
        } else if (timer === 0) {
            // Completed
            setIsActive(false)
            handleSuccess()
        }
        return () => clearInterval(interval)
    }, [isActive, timer])

    const handleStart = () => {
        setTimer(300) // Reset to 300
        setIsActive(true)
    }

    const handleSuccess = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        })
        onComplete()
        setIsOpen(false)
        setTimer(300)
    }

    const handleCancel = () => {
        setIsActive(false)
        setTimer(300)
        setIsOpen(false)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((300 - timer) / 300) * 100

    return (
        <>
            {/* Floating SOS Button - Fixed to bottom right or integrated nicely */}
            {/* For now, let's make it a prominent button likely used in the UI flow rather than fixed to avoid overlap issues */}
            <Button
                variant="destructive"
                size="lg"
                className="w-full h-16 text-lg font-bold shadow-lg animate-pulse hover:animate-none group relative overflow-hidden"
                onClick={() => setIsOpen(true)}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <ShieldAlert className="w-6 h-6 mr-2" />
                SOS - I NEED HELP
            </Button>

            <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex flex-col items-center gap-2">
                            <ShieldAlert className="w-12 h-12 text-red-500" />
                            Emergency Support
                        </DialogTitle>
                        <DialogDescription className="text-lg">
                            Hold on for 5 minutes. You can overcome this craving.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        {!isActive && timer === 300 ? (
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    Click start to begin the timer. We will help you distract yourself.
                                </p>
                                <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleStart}>
                                    Start Timer
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative w-48 h-48 mx-auto flex items-center justify-center rounded-full border-8 border-red-100 dark:border-red-900">
                                    <div className="text-4xl font-bold font-mono">
                                        {formatTime(timer)}
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            className="text-red-500 transition-all duration-1000 ease-linear"
                                            strokeWidth="8"
                                            strokeDasharray="251.2"
                                            strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                        />
                                    </svg>
                                </div>
                                <div className="min-h-[60px] flex items-center justify-center">
                                    <p className="text-lg font-medium text-red-600 dark:text-red-400 animate-fade-in">
                                        "{MOTIVATIONAL_MESSAGES[messageIndex]}"
                                    </p>
                                </div>
                                <Button variant="outline" onClick={handleCancel}>
                                    I gave up (Stop Timer)
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
