'use client'

import { Lock, CheckCircle2, Zap, Brain, MapPin, ChevronDown, PlayCircle } from 'lucide-react'
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
    const [expanded, setExpanded] = useState<number | null>(nextMilestone?.days || MILESTONES[0].days)

    const toggleExpand = (days: number) => {
        setExpanded(prev => prev === days ? null : days)
    }

    return (
        <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-1 mb-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t('timeline.journey_map')}
                </h2>
                {nextMilestone && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <PlayCircle className="w-3.5 h-3.5 text-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary">
                            {nextMilestone.days - currentStreak} {t('timeline.days_to_quest')}
                        </span>
                    </div>
                )}
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative pl-6 sm:pl-8">
                
                {/* Vertical Spine (Background Line) */}
                <div className="absolute top-2 bottom-0 left-[35px] sm:left-[43px] w-1 bg-surface-container-high rounded-full" />
                
                {/* Active Progress Line overlaying the spine */}
                <div 
                    className="absolute top-2 left-[35px] sm:left-[43px] w-1 bg-primary rounded-full transition-all duration-1000 ease-out" 
                    style={{ 
                        height: `${Math.min(100, (MILESTONES.findIndex(m => m === nextMilestone) / (MILESTONES.length - 1)) * 100)}%` 
                    }} 
                />

                <div className="space-y-8 relative z-10">
                    {MILESTONES.map((milestone, index) => {
                        const isUnlocked = currentStreak >= milestone.days
                        const isNext = nextMilestone === milestone
                        const isExpanded = expanded === milestone.days

                        return (
                            <div key={milestone.days} className="relative flex items-start gap-6 group">

                                {/* Timeline Node / Dot */}
                                <div className="relative mt-1">
                                    <div className={cn(
                                        "flex items-center justify-center w-8 h-8 rounded-full border-4 shadow-sm z-10 bg-background transition-colors duration-500",
                                        isUnlocked ? "border-primary" : "border-surface-container-highest",
                                        isNext ? "border-primary ring-4 ring-primary/20 animate-pulse bg-primary/10" : ""
                                    )}>
                                        {isUnlocked ? (
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        ) : isNext ? (
                                            <PlayCircle className="w-4 h-4 text-primary" />
                                        ) : (
                                            <Lock className="w-3 h-3 text-muted-foreground opacity-50" />
                                        )}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div 
                                    className="flex-1 cursor-pointer"
                                    onClick={() => toggleExpand(milestone.days)}
                                >
                                    <div className={cn(
                                        "rounded-3xl p-5 transition-all duration-300",
                                        isUnlocked ? "bg-surface-container-lowest shadow-sm" : "bg-transparent opacity-60 hover:opacity-100",
                                        isNext ? "bg-surface-container-lowest ring-1 ring-primary/20 shadow-md shadow-primary/5" : ""
                                    )}>
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded w-fit",
                                                    isUnlocked || isNext ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                                )}>
                                                    Day {milestone.days}
                                                </span>
                                                <h3 className={cn(
                                                    "text-lg font-black tracking-tight",
                                                    isUnlocked || isNext ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {t(`milestones.${milestone.days}.title`)}
                                                </h3>
                                            </div>
                                            <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")}>
                                                <ChevronDown className="w-5 h-5 text-muted-foreground opacity-50" />
                                            </div>
                                        </div>

                                        {/* Expandable Details */}
                                        <div className={cn(
                                            "overflow-hidden transition-all duration-500 ease-in-out",
                                            isExpanded ? "max-h-[500px] mt-6 opacity-100" : "max-h-0 opacity-0"
                                        )}>
                                            <div className="grid gap-3">
                                                <div className="flex gap-3 items-start p-4 rounded-2xl bg-amber-500/10">
                                                    <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0 stroke-1" />
                                                    <div>
                                                        <p className="font-bold text-[10px] text-amber-600 uppercase tracking-widest mb-1">{t('timeline.body')}</p>
                                                        <p className="text-xs text-foreground/80 leading-relaxed font-medium">{t(`milestones.${milestone.days}.body`)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 items-start p-4 rounded-2xl bg-violet-500/10">
                                                    <Brain className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0 stroke-1" />
                                                    <div>
                                                        <p className="font-bold text-[10px] text-violet-600 uppercase tracking-widest mb-1">{t('timeline.mind')}</p>
                                                        <p className="text-xs text-foreground/80 leading-relaxed font-medium">{t(`milestones.${milestone.days}.mind`)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
