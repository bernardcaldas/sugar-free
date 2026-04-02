'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { LogOut, Sun, Moon, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useDailyLogs } from '@/hooks/useDailyLogs'
import { calculateStreak } from '@/lib/utils'
import { useMemo, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/LanguageContext'

export function Header() {
    const router = useRouter()
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()
    const { language, setLanguage } = useLanguage()

    const { logs, fetchLogs } = useDailyLogs(user?.id)

    useEffect(() => {
        if (user) fetchLogs(new Date())
    }, [user, fetchLogs])

    const streak = useMemo(() => calculateStreak(logs), [logs])
    const today = format(new Date(), 'EEEE, MMMM do')

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const userInitial = user?.email ? user.email[0].toUpperCase() : '?'

    return (
        <header className="flex h-14 items-center justify-between border-b border-border px-6 bg-background">
            <div className="flex flex-col">
                <Link href="/app">
                    <span className="text-sm font-semibold tracking-tight text-foreground">Sugar Free</span>
                </Link>
                <p className="text-[11px] text-muted-foreground" suppressHydrationWarning>{today}</p>
            </div>

            <div className="flex items-center gap-1.5">
                {/* Streak badge — clean slate */}
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm font-semibold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{streak}</span>
                </div>

                {user && (
                    <div
                        className="flex items-center justify-center h-7 w-7 rounded-full border border-border bg-secondary text-foreground text-xs font-semibold"
                        title={user.email}
                    >
                        {userInitial}
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLanguage(language === 'en' ? 'pt-br' : 'en')}
                    title="Switch Language"
                    className="h-8 w-8"
                >
                    <span className="text-[10px] font-bold">{language?.toUpperCase()}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    title="Toggle Theme"
                    className="h-8 w-8"
                >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    )
}
