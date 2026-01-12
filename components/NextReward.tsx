'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MILESTONES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface NextRewardProps {
    currentStreak: number
}

export function NextReward({ currentStreak }: NextRewardProps) {
    // Find next milestone
    const nextMilestone = MILESTONES.find(m => m.days > currentStreak)

    // If no next milestone (completed all), maybe show a "Master" state or nothing
    if (!nextMilestone) {
        return (
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Next Reward</h2>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-green-700 dark:text-green-400">All Milestones Achieved!</h3>
                            <p className="text-sm text-green-600/80">You are a legend. Keep going!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Calculate distinct progress just for this step
    // Previous milestone days (or 0 if first)
    const prevMilestoneDays = MILESTONES.findLast(m => m.days <= currentStreak)?.days || 0

    // To show valid progress bar from 0 to 100 relative to THIS step:
    // Total distance = Next - Prev
    // Current distance = Current - Prev
    const totalDistance = nextMilestone.days - prevMilestoneDays
    const currentDistance = currentStreak - prevMilestoneDays

    // Progress percentage
    // Example: streak 4. Next is 7. Prev is 3. Dist = 4. 
    // Wait, user wants "Count of days travelled".
    // Actually simpler: 
    // User wants: "Quantos dias ja percorreu" and "Quantos faltam".
    // Text: "10 / 15 days". This implies absolute count.
    // Progress bar usually represents absolute 0 to target OR relative step.
    // Given "10 / 15", it sounds like absolute streak vs target.
    const progressPercent = Math.min(100, (currentStreak / nextMilestone.days) * 100)

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Next Reward</h2>
            <Card>
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-primary">{nextMilestone.bodyBenefit}</h3>
                            <p className="text-sm text-muted-foreground">{nextMilestone.title}</p>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                            ({nextMilestone.days} days)
                        </span>
                    </div>

                    <div className="space-y-1">
                        <Progress value={progressPercent} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{currentStreak} days</span>
                            <span>{nextMilestone.days - currentStreak} days left</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
