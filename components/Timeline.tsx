'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, CheckCircle, Zap, Brain, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MILESTONES } from '@/lib/constants'
import { useState } from 'react'

interface TimelineProps {
    currentStreak: number
}

export function Timeline({ currentStreak }: TimelineProps) {
    // Calculate progress to next milestone
    const nextMilestone = MILESTONES.find(m => m.days > currentStreak)

    // State for expanded card (interactive badges)
    const [expanded, setExpanded] = useState<number | null>(null)

    const toggleExpand = (days: number, isUnlocked: boolean) => {
        if (!isUnlocked) return
        setExpanded(prev => prev === days ? null : days)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Journey</h2>
                {nextMilestone && (
                    <span className="text-xs text-muted-foreground">
                        {nextMilestone.days - currentStreak} days to next reward
                    </span>
                )}
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {MILESTONES.map((milestone) => {
                    const isUnlocked = currentStreak >= milestone.days
                    const isNext = nextMilestone === milestone
                    const isExpanded = expanded === milestone.days

                    return (
                        <Card
                            key={milestone.days}
                            onClick={() => toggleExpand(milestone.days, isUnlocked)}
                            className={cn(
                                "min-w-[160px] snap-center transition-all duration-300 relative overflow-hidden cursor-pointer", // Reduced min-width since collapsed
                                isUnlocked
                                    ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20"
                                    : "opacity-60 grayscale border-dashed cursor-default",
                                isExpanded ? "min-w-[280px]" : ""
                            )}
                        >
                            {isUnlocked && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                            )}
                            {!isUnlocked && !isNext && (
                                <div className="absolute top-2 right-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}

                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded-full border",
                                        isUnlocked ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"
                                    )}>
                                        {milestone.days} DAYS
                                    </span>
                                </div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    {milestone.icon}
                                    {milestone.title}
                                </CardTitle>
                            </CardHeader>

                            {/* Content - Hidden unless expanded */}
                            {isExpanded && (
                                <CardContent className="space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex gap-2 items-start">
                                        <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full text-blue-600 dark:text-blue-400">
                                            <Zap className="h-3 w-3" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Body</p>
                                            <p className="text-muted-foreground text-xs">{milestone.bodyBenefit}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-start">
                                        <div className="mt-0.5 bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full text-purple-600 dark:text-purple-400">
                                            <Brain className="h-3 w-3" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Mind</p>
                                            <p className="text-muted-foreground text-xs">{milestone.mindBenefit}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center pt-2 italic">
                                        Tap to close
                                    </p>
                                </CardContent>
                            )}

                            {!isExpanded && isUnlocked && (
                                <CardContent className="pb-4 pt-0">
                                    <p className="text-[10px] text-muted-foreground">Tap to view benefits</p>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
