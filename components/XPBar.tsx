'use client'

import { Trophy, Crown } from "lucide-react"

interface XPBarProps {
    level: number
    xp: number
    nextLevelXP: number
    progress: number
}

export function XPBar({ level, xp, nextLevelXP, progress }: XPBarProps) {
    return (
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-xl shadow-border/5">

            {/* Level + XP info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Level badge */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-primary/20 text-primary flex-shrink-0 animate-pulse">
                        {level >= 5 ? <Crown className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xl font-black text-foreground uppercase tracking-widest leading-tight">Lvl {level}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Vitality</p>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end">
                    <p className="text-xl font-black tabular-nums text-foreground tracking-tighter">
                        {xp.toLocaleString()}
                        <span className="text-muted-foreground font-medium text-xs ml-1 uppercase tracking-widest">
                            / {nextLevelXP.toLocaleString()}
                        </span>
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest bg-muted px-2 py-0.5 rounded-sm">
                        {Math.round(nextLevelXP - xp).toLocaleString()} left
                    </p>
                </div>
            </div>

            {/* Progress bar — thick, mobile-friendly */}
            <div className="relative h-4 w-full rounded-full bg-surface-container-high overflow-hidden shadow-inner flex items-center p-0.5">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-out min-w-[5%]"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

        </div>
    )
}
