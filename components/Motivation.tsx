'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MotivationProps {
    streakActive: boolean
}

export function Motivation({ streakActive }: MotivationProps) {
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        const hour = new Date().getHours()
        let options: string[] = []

        // Time based messages
        if (hour >= 5 && hour < 12) {
            options = [
                "One good decision can define your day.",
                "You’re starting strong today."
            ]
        } else if (hour >= 12 && hour < 18) {
            options = [
                "You’re halfway through the day.",
                "Your body is adjusting."
            ]
        } else {
            options = [
                "You made it through today.",
                "Another day completed."
            ]
        }

        // Context based (on open)
        if (streakActive) {
            options.push("Still on track today.", "Your streak is active.")
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
    }, [streakActive])

    if (!message) return null

    return (
        <div className="text-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-sm font-medium text-muted-foreground italic">
                "{message}"
            </p>
        </div>
    )
}
