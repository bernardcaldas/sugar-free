'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isWeekend } from 'date-fns'
import toast from 'react-hot-toast'

export function DebugTrophySeeder() {
    const { user } = useAuth()

    const seedHistory = async () => {
        if (!user) return

        // Seed 3 months back
        const monthsToSeed = [1, 2, 3]

        for (const monthOffset of monthsToSeed) {
            const targetMonth = subMonths(new Date(), monthOffset)
            const start = startOfMonth(targetMonth)
            const end = endOfMonth(targetMonth)
            const days = eachDayOfInterval({ start, end })

            // Random performance based on offset
            // 1 month ago: Gold (95%)
            // 2 months ago: Silver (80%)
            // 3 months ago: Bronze (60%)

            const successThreshold = monthOffset === 1 ? 0.05 : monthOffset === 2 ? 0.2 : 0.4

            const logsPayload = days.map(day => {
                const isSuccess = Math.random() > successThreshold
                return {
                    user_id: user.id,
                    date: format(day, 'yyyy-MM-dd'),
                    success: isSuccess,
                    note: isSuccess ? 'Mock Success' : 'Mock Fail',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            })

            await supabase.from('daily_logs').upsert(logsPayload, { onConflict: 'user_id, date' })
        }

        toast.success('Seeded history for Trophies! Refresh page.')
        window.location.reload()
    }

    return (
        <div className="fixed bottom-16 right-4 z-50 opacity-70 hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" onClick={seedHistory} className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                🏆 Seed Trophies
            </Button>
        </div>
    )
}
