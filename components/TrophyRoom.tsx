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
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Wall of Fame
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            <Card className="border-dashed border-2 bg-transparent opacity-70 hover:opacity-100 transition-opacity">
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">{stat.monthName}</span>
                        <span className="text-xs font-mono text-muted-foreground">{stat.year}</span>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex flex-col items-center justify-center py-2 space-y-1">
                        <Calendar className="w-8 h-8 text-muted-foreground mb-1" />
                        <span className="text-xs font-semibold text-muted-foreground">In Progress</span>
                        <span className="text-lg font-bold">{stat.percentage}%</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Determine styles based on badge
    let colorClass = "bg-card"
    let icon = <Award className="w-8 h-8 text-gray-400" />
    let borderColor = ""
    let textColor = "text-muted-foreground"

    if (stat.badge === 'GOLD') {
        colorClass = "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/10"
        icon = <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-500 drop-shadow-sm" />
        borderColor = "border-yellow-200 dark:border-yellow-700"
        textColor = "text-yellow-700 dark:text-yellow-400"
    } else if (stat.badge === 'SILVER') {
        colorClass = "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/20 dark:to-gray-800/20"
        icon = <Medal className="w-8 h-8 text-slate-500 dark:text-slate-400" />
        borderColor = "border-slate-200 dark:border-slate-700"
        textColor = "text-slate-700 dark:text-slate-300"
    } else if (stat.badge === 'BRONZE') {
        colorClass = "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10"
        icon = <Medal className="w-8 h-8 text-orange-600/80 dark:text-orange-500" />
        borderColor = "border-orange-200 dark:border-orange-800"
        textColor = "text-orange-800 dark:text-orange-400"
    }

    return (
        <Card className={cn("transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer group relative overflow-hidden", colorClass, borderColor)}>

            {/* Glossy effect for gold */}
            {stat.badge === 'GOLD' && (
                <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            )}

            <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start space-y-0">
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{stat.monthName}</span>
                    <span className="text-[10px] text-muted-foreground">{stat.year}</span>
                </div>
                {stat.badge === 'GOLD' && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full">MVP</span>}
            </CardHeader>
            <CardContent className="p-3 pt-2 text-center">
                <div className="py-2 flex flex-col items-center justify-center gap-1">
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                    <span className={cn("text-2xl font-black tracking-tight", textColor)}>
                        {stat.percentage}%
                    </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                    {stat.successDays} / {stat.totalDays} Days
                </div>
            </CardContent>
        </Card>
    )
}
