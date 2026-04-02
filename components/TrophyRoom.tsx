'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award, Calendar } from 'lucide-react'
import { MonthStat } from '@/hooks/useMonthlyHistory'
import { cn } from '@/lib/utils'

interface TrophyRoomProps {
    history: MonthStat[]
}

export function TrophyRoom({ history }: TrophyRoomProps) {
    // Filter out current month for the main trophy display? 
    // Or keep it as "In Progress".
    // Let's separate them.

    // Only show months that have passed or have significant data?
    // Let's show all.

    return (
        <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2">
                Wall of Fame
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {history.map((stat) => (
                    <TrophyCard key={stat.monthKey} stat={stat} />
                ))}
            </div>
        </div>
    )
}

function TrophyCard({ stat }: { stat: MonthStat }) {
    if (stat.isCurrentMonth) {
        return (
            <div className="rounded-3xl border border-dashed border-border bg-transparent opacity-70 p-4 flex flex-col justify-between aspect-square">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.monthName}</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                    <Calendar className="w-8 h-8 text-muted-foreground stroke-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">In Progress</span>
                    <span className="text-2xl font-serif font-black text-muted-foreground">{stat.percentage}%</span>
                </div>
            </div>
        )
    }

    // Determine styles based on badge
    let colorClass = "bg-surface-container-low hover:bg-surface-container-high"
    let icon = <Award className="w-10 h-10 text-muted-foreground stroke-1" />
    let textColor = "text-foreground"

    if (stat.badge === 'GOLD') {
        colorClass = "bg-amber-500/10 hover:bg-amber-500/20"
        icon = <Trophy className="w-10 h-10 text-amber-600 dark:text-amber-500 stroke-1" />
        textColor = "text-amber-700 dark:text-amber-400"
    } else if (stat.badge === 'SILVER') {
        colorClass = "bg-slate-500/10 hover:bg-slate-500/20"
        icon = <Medal className="w-10 h-10 text-slate-600 dark:text-slate-400 stroke-1" />
        textColor = "text-slate-700 dark:text-slate-300"
    } else if (stat.badge === 'BRONZE') {
        colorClass = "bg-orange-500/10 hover:bg-orange-500/20"
        icon = <Medal className="w-10 h-10 text-orange-600 dark:text-orange-500 stroke-1" />
        textColor = "text-orange-800 dark:text-orange-400"
    }

    return (
        <div className={cn("rounded-3xl p-4 flex flex-col justify-between aspect-square transition-all duration-300 relative overflow-hidden group", colorClass)}>
            {/* Glossy effect for gold */}
            {stat.badge === 'GOLD' && (
                <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white/40 dark:to-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity" />
            )}

            <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest">{stat.monthName}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{stat.year}</span>
                </div>
                {stat.badge === 'GOLD' && <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">MVP</span>}
            </div>
            
            <div className="flex flex-col items-center justify-center gap-1 mt-auto">
                <div className="transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                    {icon}
                </div>
                <span className={cn("text-4xl font-serif font-black tracking-tighter", textColor)}>
                    {stat.percentage}%
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">
                    {stat.successDays}/{stat.totalDays}
                </span>
            </div>
        </div>
    )
}
