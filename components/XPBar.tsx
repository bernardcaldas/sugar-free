'use client'

import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Crown, Zap } from "lucide-react"

interface XPBarProps {
    level: number
    xp: number
    nextLevelXP: number
    progress: number
}

export function XPBar({ level, xp, nextLevelXP, progress }: XPBarProps) {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:shadow-primary/20">
            {/* Ambient Glow */}
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative p-6 space-y-4">
                {/* Header Stats */}
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                        {/* Level Orb */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-amber-500/30 ring-2 ring-white/20">
                            <div className="absolute inset-0 rounded-full bg-white/20 mix-blend-overlay" />
                            {level >= 5 ? <Crown className="h-8 w-8 text-white drop-shadow-md" /> : <Trophy className="h-8 w-8 text-white drop-shadow-md" />}
                            <div className="absolute -bottom-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm border border-white/10">
                                LVL {level}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-black tracking-tight text-white drop-shadow-sm italic">
                                LEVEL {level}
                            </h2>
                            <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                                Vitality Rank
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-amber-400">
                            <Zap className="h-4 w-4 fill-amber-400 animate-pulse" />
                            <span className="text-lg font-bold tabular-nums tracking-tight">{xp.toLocaleString()}</span>
                            <span className="text-xs font-semibold text-white/40">/ {nextLevelXP.toLocaleString()} XP</span>
                        </div>
                        <p className="text-[10px] font-medium text-white/40 mt-1">
                            {Math.round(nextLevelXP - xp).toLocaleString()} creates to next level
                        </p>
                    </div>
                </div>

                {/* Liquid Progress Bar */}
                <div className="relative h-6 w-full rounded-full bg-black/40 ring-1 ring-white/10 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}
                    />

                    {/* The Bar */}
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-1000 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
