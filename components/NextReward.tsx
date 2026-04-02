'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MILESTONES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface NextRewardProps {
    currentStreak: number
}

import { useLanguage } from '@/contexts/LanguageContext'

export function NextReward({ currentStreak }: NextRewardProps) {
    const { t } = useLanguage()
    // Find next milestone
    const nextMilestone = MILESTONES.find(m => m.days > currentStreak)

    // If no next milestone (completed all), maybe show a "Master" state or nothing
    if (!nextMilestone) {
        return (
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{t('journey.next_reward.title')}</h2>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-green-700 dark:text-green-400">
                                {t('journey.next_reward.completed_title')}
                            </h3>
                            <p className="text-sm text-green-600/80">
                                {t('journey.next_reward.completed_subtitle')}
                            </p>
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
        <div className="mb-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2">{t('journey.next_reward.title')}</h2>
            <div className="bg-surface-container-low rounded-[2rem] p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">{t(`milestones.${nextMilestone.days}.title`)}</p>
                        <h3 className="text-2xl font-black text-foreground tracking-tight mt-1 leading-tight">
                            {t(`milestones.${nextMilestone.days}.body`)}
                        </h3>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <span className="text-4xl font-black tracking-tighter text-foreground">{currentStreak}</span>
                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">/ {nextMilestone.days} {t('common.days')}</span>
                    </div>
                    
                    <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-1000 min-w-[5%]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-black text-muted-foreground pt-1">
                        <span>Current</span>
                        <span>{nextMilestone.days - currentStreak} {t('journey.next_reward.days_left')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
