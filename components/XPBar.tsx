'use client'

import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Crown } from "lucide-react"

interface XPBarProps {
    level: number
    xp: number
    nextLevelXP: number
    progress: number
}

export function XPBar({ level, xp, nextLevelXP, progress }: XPBarProps) {
    return (
        <div className="w-full bg-card p-4 rounded-xl shadow-sm border space-y-3">
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-600 dark:text-yellow-400">
                        {level >= 5 ? <Crown className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                    </div>
                    <span>Level {level}</span>
                </div>
                <div className="text-muted-foreground font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{xp}</span>
                    <span className="text-muted-foreground/50">/ {nextLevelXP} XP</span>
                </div>
            </div>

            <div className="relative">
                <Progress value={progress} className="h-3 bg-secondary" indicatorClassName="bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="absolute right-0 top-4 text-xs text-muted-foreground font-medium">
                    {Math.round(progress)}% to Level {level + 1}
                </div>
            </div>
        </div>
    )
}
