'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface MotivationProps {
    streakActive: boolean
}

export function Motivation({ streakActive }: MotivationProps) {
    const [message, setMessage] = useState<string | null>(null)

    const { t } = useLanguage()

    useEffect(() => {
        const hour = new Date().getHours()
        let options: string[] = []

        // Time based messages
        if (hour >= 5 && hour < 12) {
            options = [
                t('motivation.morning.1'),
                t('motivation.morning.2')
            ]
        } else if (hour >= 12 && hour < 18) {
            options = [
                t('motivation.afternoon.1'),
                t('motivation.afternoon.2')
            ]
        } else {
            options = [
                t('motivation.evening.1'),
                t('motivation.evening.2')
            ]
        }

        // Context based (on open)
        if (streakActive) {
            options.push(t('motivation.streak.1'), t('motivation.streak.2'))
        }

        // Pick one random
        const random = options[Math.floor(Math.random() * options.length)]
        setMessage(random)

        // Cleanup: remove message after 5 seconds to be "non-intrusive"
        // Wait, user said "Sumir automaticamente após poucos segundos"
        const timer = setTimeout(() => {
            // Optional: fade out? For now just keeping it simple or maybe keep it longer?
            // "Sumir automaticamente após poucos segundos" -> Yes.
            setMessage(null)
        }, 8000)

        return () => clearTimeout(timer)
    }, [streakActive, t])

    if (!message) return null

    return (
        <div className="text-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-sm font-medium text-muted-foreground italic">
                "{message}"
            </p>
        </div>
    )
}
