'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function StatsCard({ streak, percentage }: { streak: number, percentage: number }) {
    const { t } = useLanguage()

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('home.stats.current_streak')}</CardTitle>
                    <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{streak}</div>
                    <p className="text-xs text-muted-foreground">{t('home.stats.streak_msg')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('home.stats.month_success')}</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{percentage}%</div>
                    <p className="text-xs text-muted-foreground">{t('home.stats.month_msg')}</p>
                </CardContent>
            </Card>
        </div>
    )
}
