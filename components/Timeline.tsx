'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, CheckCircle, Zap, Brain, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MILESTONES } from '@/lib/constants'

interface TimelineProps {
    currentStreak: number
}

export function Timeline({ currentStreak }: TimelineProps) {
    // Calculate progress to next milestone
    const nextMilestone = MILESTONES.find(m => m.days > currentStreak)
    const prevMilestone = [...MILESTONES].reverse().find(m => m.days <= currentStreak)

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

                    return (
                        <Card
                            key={milestone.days}
                            className={cn(
                                "min-w-[280px] snap-center transition-all duration-300 relative overflow-hidden",
                                isUnlocked
                                    ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10"
                                    : "opacity-60 grayscale border-dashed"
                            )}
                        >
                            {isUnlocked && (
                                <div className="absolute top-0 right-0 p-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                            )}
                            {!isUnlocked && !isNext && (
                                <div className="absolute top-0 right-0 p-2">
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
                                <CardTitle className="text-base">{milestone.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
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
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
