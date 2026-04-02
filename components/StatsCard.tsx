'use client'

import { CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function StatsCard({ streak, percentage }: { streak: number, percentage: number }) {
    const { t } = useLanguage()

    return (
        <div className="flex flex-col items-center justify-center py-8">
            {/* Massive Typography Streak */}
            <div className="text-center space-y-1">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                    {t('home.stats.current_streak')}
                </p>
                <div className="text-[5rem] leading-none font-bold tracking-tighter text-primary">
                    {streak}
                </div>
                <p className="text-sm font-medium text-foreground">
                    {t('home.stats.streak_msg')}
                </p>
            </div>

            {/* Subtle Progress Pill */}
            <div className="mt-8 inline-flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold tracking-tight">
                    {percentage}% <span className="font-normal text-muted-foreground">{t('home.stats.month_msg')}</span>
                </span>
            </div>
        </div>
    )
}
