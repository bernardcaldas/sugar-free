import { useMemo, useState, useEffect } from 'react'
import { DailyLog } from '@/types'
import { calculateXP, calculateLevel, calculateTickets, XP_PER_SOS } from '@/lib/gamification'

export function useGameMechanics(logs: DailyLog[]) {
    const [sosActive, setSosActive] = useState(false)
    const [sosTimer, setSosTimer] = useState(300) // 5 minutes in seconds

    const xp = useMemo(() => calculateXP(logs), [logs])
    const levelData = useMemo(() => calculateLevel(xp), [xp])
    const ticketData = useMemo(() => calculateTickets(logs), [logs])

    // SOS Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (sosActive && sosTimer > 0) {
            interval = setInterval(() => {
                setSosTimer((prev) => prev - 1)
            }, 1000)
        } else if (sosTimer === 0) {
            setSosActive(false)
        }
        return () => clearInterval(interval)
    }, [sosActive, sosTimer])

    const startSOS = () => {
        setSosTimer(300)
        setSosActive(true)
    }

    const cancelSOS = () => {
        setSosActive(false)
        setSosTimer(300)
    }

    const completeSOS = () => {
        // Logic to award SOS XP is handled by caller (adding a log or updating local state)
        setSosActive(false)
        setSosTimer(300)
        return XP_PER_SOS
    }

    return {
        xp,
        level: levelData.level,
        nextLevelXP: levelData.nextLevelXP,
        levelProgress: levelData.progress,
        ticketsAvailable: ticketData.available,
        nextTicketIn: ticketData.nextTicketIn,
        sosActive,
        sosTimer,
        startSOS,
        cancelSOS,
        completeSOS
    }
}
