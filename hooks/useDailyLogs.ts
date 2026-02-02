import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { DailyLog } from '@/types'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import toast from 'react-hot-toast'

export function useDailyLogs(user_id: string | undefined) {
    const [logs, setLogs] = useState<DailyLog[]>([])
    const [loading, setLoading] = useState(false)

    const fetchLogs = useCallback(async (date: Date) => {
        if (!user_id) return
        setLoading(true)
        const start = format(startOfMonth(date), 'yyyy-MM-dd')
        const end = format(endOfMonth(date), 'yyyy-MM-dd')

        const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', user_id)
            .gte('date', start)
            .lte('date', end)
            .order('date', { ascending: true })

        if (error) {
            console.error(error)
            toast.error('Failed to load logs')
        } else {
            setLogs(data || [])
        }
        setLoading(false)
    }, [user_id])

    const fetchAllLogs = useCallback(async () => {
        if (!user_id) return
        setLoading(true)

        // Fetch all logs for the user (for history/trophies)
        const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', user_id)
            .order('date', { ascending: true })

        if (error) {
            console.error(error)
        } else {
            setLogs(data || [])
        }
        setLoading(false)
    }, [user_id])

    const markDay = async (date: Date, success: boolean, note?: string, is_ticket?: boolean) => {
        if (!user_id) return false
        const dateStr = format(date, 'yyyy-MM-dd')

        const { error } = await supabase
            .from('daily_logs')
            .upsert({
                user_id,
                date: dateStr,
                success,
                note,
                is_ticket: is_ticket || false,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, date' })

        if (error) {
            toast.error(error.message)
            return false
        } else {
            if (is_ticket) {
                toast.success('Ticket used wisely!')
            } else {
                toast.success(success ? 'Day saved! Great job!' : 'Day marked. Keep going!')
            }

            setLogs(prev => {
                const exists = prev.find(l => l.date === dateStr)
                if (exists) {
                    return prev.map(l => l.date === dateStr ? { ...l, success, note, is_ticket } : l)
                }
                // Mock new log for immediate UI update
                const newLog: DailyLog = {
                    id: 'temp-' + Date.now(),
                    user_id,
                    date: dateStr,
                    success,
                    note,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
                return [...prev, newLog].sort((a, b) => a.date.localeCompare(b.date))
            })
            return true
        }
    }

    return { logs, loading, fetchLogs, fetchAllLogs, markDay }
}
