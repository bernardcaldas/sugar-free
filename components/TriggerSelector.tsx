'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TriggerType } from "@/types"

interface TriggerSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (trigger: TriggerType) => void
}

const TRIGGERS: { id: TriggerType; label: string; icon: string; color: string }[] = [
    { id: 'boredom', label: 'Tédio', icon: '🥱', color: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' },
    { id: 'stress', label: 'Estresse', icon: '😰', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' },
    { id: 'social', label: 'Social', icon: '🎉', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' },
    { id: 'work', label: 'Trabalho', icon: '🏢', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
    { id: 'hunger', label: 'Fome', icon: '🤤', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' },
    { id: 'craving', label: 'Vontade', icon: '🍪', color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' },
]

import { useLanguage } from '@/contexts/LanguageContext'

export function TriggerSelector({ open, onOpenChange, onSelect }: TriggerSelectorProps) {
    const { t } = useLanguage()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                        🤝
                    </div>
                    <DialogTitle className="text-center text-xl">{t('triggers.title')}</DialogTitle>
                    <DialogDescription className="text-center text-base">
                        {t('triggers.subtitle_1')}<br />
                        {t('triggers.subtitle_2')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
                    {TRIGGERS.map((item) => (
                        <Button
                            key={item.id}
                            variant="outline"
                            className={cn(
                                "h-20 flex flex-col gap-1 items-center justify-center border transition-all duration-200 hover:scale-[1.02]",
                                item.color
                            )}
                            onClick={() => onSelect(item.id)}
                        >
                            <span className="text-xl" role="img" aria-label={t(`triggers.${item.id}`)}>
                                {item.icon}
                            </span>
                            <span className="text-xs font-semibold">{t(`triggers.${item.id}`)}</span>
                        </Button>
                    ))}
                </div>
                <div className="text-center text-xs text-muted-foreground">
                    {t('triggers.footer')}
                </div>
            </DialogContent>
        </Dialog>
    )
}
