'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoodType } from "@/types"

interface EmotionSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (mood: MoodType) => void
}

const MOODS: { id: MoodType; label: string; icon: string; color: string }[] = [
    { id: 'excited', label: 'Animado', icon: '😊', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' },
    { id: 'peaceful', label: 'Em Paz', icon: '😌', color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' },
    { id: 'neutral', label: 'Neutro', icon: '😐', color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200' },
    { id: 'tired', label: 'Cansado', icon: '😫', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
]

export function EmotionSelector({ open, onOpenChange, onSelect }: EmotionSelectorProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Como você está hoje?</DialogTitle>
                    <DialogDescription className="text-center">
                        Registre seu humor para entender seus padrões de vitória.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-4">
                    {MOODS.map((mood) => (
                        <Button
                            key={mood.id}
                            variant="outline"
                            className={cn(
                                "h-24 flex flex-col gap-2 items-center justify-center border-2 transition-all duration-200",
                                mood.color
                            )}
                            onClick={() => onSelect(mood.id)}
                        >
                            <span className="text-3xl" role="img" aria-label={mood.label}>
                                {mood.icon}
                            </span>
                            <span className="font-semibold">{mood.label}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
