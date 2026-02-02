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
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Journey Map
                </h2>
                {nextMilestone && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <PlayCircle className="w-3.5 h-3.5 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary">
                            {nextMilestone.days - currentStreak} Days to Quest
                        </span>
                    </div>
                )}
            </div>

            {/* Horizontal Scroll Container with Path Line */}
            <div className="relative group/container">
                {/* Connecting Path Line */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 via-primary/20 to-muted/20" />

                <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 snap-x no-scrollbar relative z-10">
                    {MILESTONES.map((milestone, index) => {
                        const isUnlocked = currentStreak >= milestone.days
                        const isNext = nextMilestone === milestone
                        const isExpanded = expanded === milestone.days
                        const isLastUnlocked = MILESTONES[index + 1]?.days > currentStreak && isUnlocked

                        return (
                            <div key={milestone.days} className="relative flex-shrink-0 snap-center group">
                                {/* Connector Dot on Line */}
                                <div className={cn(
                                    "absolute top-6 left-1/2 -ml-1.5 w-3 h-3 rounded-full border-2 z-0 transition-colors duration-500",
                                    isUnlocked ? "bg-green-500 border-green-200" : "bg-muted border-muted-foreground",
                                    isNext ? "animate-ping bg-primary border-primary" : ""
                                )} />

                                <Card
                                    onClick={() => toggleExpand(milestone.days, isUnlocked)}
                                    className={cn(
                                        "mt-6 w-[280px] transition-all duration-300 relative overflow-hidden cursor-pointer backdrop-blur-sm border-2",
                                        isUnlocked
                                            ? "bg-gradient-to-b from-green-50/90 to-white/50 dark:from-green-900/20 dark:to-transparent border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10"
                                            : "bg-muted/30 border-muted grayscale opacity-70 cursor-default",
                                        isNext
                                            ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-xl opacity-100 grayscale-0 border-primary"
                                            : "",
                                        isExpanded ? "h-auto bg-white/90 dark:bg-black/90 z-20" : "h-[90px]"
                                    )}
                                >
                                    {isUnlocked && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-100 dark:fill-green-900" />
                                        </div>
                                    )}
                                    {!isUnlocked && !isNext && (
                                        <div className="absolute top-2 right-2 opacity-50">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                    )}

                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg shadow-inner",
                                                isUnlocked ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                                            )}>
                                                {milestone.days}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    Milestone
                                                </p>
                                                <CardTitle className="text-sm font-bold leading-tight">
                                                    {t(`milestones.${milestone.days}.title`)}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {/* Expanded Content with Animation */}
                                    <CardContent className={cn(
                                        "p-4 pt-2 space-y-4 text-sm transition-all duration-500 ease-in-out origin-top",
                                        isExpanded ? "opacity-100 max-h-[300px]" : "opacity-0 max-h-0 hidden"
                                    )}>
                                        <div className="w-full h-px bg-border/50 my-2" />

                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex gap-3 items-start p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
                                                <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-xs text-blue-700 dark:text-blue-300 uppercase">Body Impact</p>
                                                    <p className="text-xs text-foreground/80 leading-relaxed">{t(`milestones.${milestone.days}.body`)}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 items-start p-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/20">
                                                <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-xs text-purple-700 dark:text-purple-300 uppercase">Mind Impact</p>
                                                    <p className="text-xs text-foreground/80 leading-relaxed">{t(`milestones.${milestone.days}.mind`)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>

                                    {!isExpanded && isUnlocked && (
                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground/40 rotate-90" />
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
