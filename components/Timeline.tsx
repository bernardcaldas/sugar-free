'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, CheckCircle2, Zap, Brain, MapPin, ChevronRight, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MILESTONES } from '@/lib/constants'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TimelineProps {
    currentStreak: number
}

export function Timeline({ currentStreak }: TimelineProps) {
    const { t } = useLanguage()
    const nextMilestone = MILESTONES.find(m => m.days > currentStreak)
    const [expanded, setExpanded] = useState<number | null>(null)

    const toggleExpand = (days: number, isUnlocked: boolean) => {
        if (!isUnlocked) return
        setExpanded(prev => prev === days ? null : days)
    }

    return (
        <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {t('timeline.journey_map')}
                </h2>
                {nextMilestone && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <PlayCircle className="w-3.5 h-3.5 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary">
                            {nextMilestone.days - currentStreak} {t('timeline.days_to_quest')}
                        </span>
                    </div>
                )}
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative group/container pb-12 pt-4">

                {/* The Path Line - Positioned lower to separate from cards */}
                <div className="absolute top-[85%] left-0 right-0 h-1.5 bg-gradient-to-r from-muted/30 via-muted to-muted/30 rounded-full overflow-hidden">
                    {/* Progress Fill - Mocked rough progress based on streak vs max milestone */}
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-primary animate-pulse"
                        style={{ width: `${Math.min(100, (currentStreak / 90) * 100)}%` }} // 90 days as approx max for visuals
                    />
                </div>

                <div className="flex gap-8 overflow-x-auto pb-8 pt-4 px-4 snap-x no-scrollbar relative z-10 items-end min-h-[320px]">
                    {MILESTONES.map((milestone, index) => {
                        const isUnlocked = currentStreak >= milestone.days
                        const isNext = nextMilestone === milestone
                        const isExpanded = expanded === milestone.days

                        return (
                            <div key={milestone.days} className="relative flex flex-col items-center justify-end snap-center group h-full">

                                {/* The Card - Floating Above */}
                                <div className={cn("transition-all duration-500 ease-spring", isExpanded ? "mb-6" : "mb-8")}>
                                    <Card
                                        onClick={() => toggleExpand(milestone.days, isUnlocked)}
                                        className={cn(
                                            "w-[260px] transition-all duration-300 relative overflow-hidden cursor-pointer backdrop-blur-md border",
                                            isUnlocked
                                                ? "bg-gradient-to-b from-white/80 to-white/40 dark:from-zinc-900/80 dark:to-zinc-900/40 border-green-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-green-500/20"
                                                : "bg-muted/10 border-white/5 dark:border-white/5 grayscale opacity-60 hover:opacity-80 hover:grayscale-0",
                                            isNext
                                                ? "ring-2 ring-primary ring-offset-4 ring-offset-background scale-105 shadow-xl shadow-primary/20 border-primary"
                                                : "",
                                            isExpanded ? "z-20 scale-100" : ""
                                        )}
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-0 right-0 p-3">
                                            {isUnlocked ? (
                                                <div className="bg-green-500/10 p-1.5 rounded-full ring-1 ring-green-500/20">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                            ) : (
                                                <Lock className="h-4 w-4 text-muted-foreground/50" />
                                            )}
                                        </div>

                                        <CardHeader className="p-5 pb-3">
                                            <div className="space-y-1">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded w-fit",
                                                    isUnlocked ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
                                                )}>
                                                    Day {milestone.days}
                                                </span>
                                                <CardTitle className="text-base font-bold leading-tight pt-1">
                                                    {t(`milestones.${milestone.days}.title`)}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>

                                        {/* Content */}
                                        <CardContent className={cn(
                                            "p-5 pt-0 space-y-4 text-sm transition-all duration-500 ease-in-out",
                                            isExpanded ? "opacity-100 max-h-[400px]" : "opacity-60 max-h-0 hidden"
                                        )}>
                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />

                                            <div className="grid gap-3">
                                                <div className="flex gap-3 items-start p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                                    <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">{t('timeline.body')}</p>
                                                        <p className="text-xs text-foreground/80 leading-relaxed">{t(`milestones.${milestone.days}.body`)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 items-start p-2.5 rounded-lg bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
                                                    <Brain className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-[10px] text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-0.5">{t('timeline.mind')}</p>
                                                        <p className="text-xs text-foreground/80 leading-relaxed">{t(`milestones.${milestone.days}.mind`)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        {!isExpanded && (
                                            <div className="absolute bottom-1 left-0 right-0 flex justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="h-4 w-4 text-muted-foreground/40 rotate-90" />
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                {/* Connection Stem */}
                                <div className={cn(
                                    "absolute bottom-4 w-0.5 h-8 bg-gradient-to-b from-border to-transparent",
                                    isUnlocked ? "from-green-500/50" : "from-muted-foreground/30",
                                    isExpanded ? "h-6" : "h-8"
                                )} />

                                {/* The Node on the Line */}
                                <div className={cn(
                                    "absolute bottom-0 w-4 h-4 rounded-full border-2 transform translate-y-1/2 shadow-sm transition-all duration-500",
                                    isUnlocked
                                        ? "bg-green-500 border-white dark:border-zinc-900 ring-4 ring-green-500/20"
                                        : "bg-muted border-muted-foreground/50",
                                    isNext
                                        ? "scale-125 animate-pulse bg-primary border-white ring-4 ring-primary/30"
                                        : ""
                                )} />

                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
