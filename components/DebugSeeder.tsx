'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isWeekend } from 'date-fns'
import toast from 'react-hot-toast'

export function DebugSeeder() {
    const { user } = useAuth()

    const seedPrevMonth = async () => {
        if (!user) return

        const prevMonth = subMonths(new Date(), 1) // January if now is Feb
        const start = startOfMonth(prevMonth)
        const end = endOfMonth(prevMonth)

        const days = eachDayOfInterval({ start, end })

        const logsPayload = days.map(day => {
            // Mock logic: 80% success rate, weekends maybe harder?
            // Let's make it simple: Random success
            const isSuccess = Math.random() > 0.2

            return {
                user_id: user.id,
                date: format(day, 'yyyy-MM-dd'),
                success: isSuccess,
                note: isSuccess ? 'Seeded success' : 'Seeded fail',
                is_ticket: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        })

        const { error } = await supabase
            .from('daily_logs')
            .upsert(logsPayload, { onConflict: 'user_id, date' })

        if (error) {
            toast.error('Seed failed: ' + error.message)
        } else {
            toast.success(`Seeded ${logsPayload.length} logs for ${format(prevMonth, 'MMMM')}`)
            window.location.reload() // Reload to see changes (though Recap needs to fetch it)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 opacity-70 hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm" onClick={seedPrevMonth} className="text-xs bg-gray-800 text-white border border-gray-700">
                🌱 Seed Jan Data
            </Button>
        </div>
    )
}
