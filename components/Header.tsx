'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Settings, LogOut, User as UserIcon, Sun, Moon, Flame } from 'lucide-react'
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

    // Fetch logs for Vitality display
    const { logs, fetchLogs } = useDailyLogs(user?.id)

    useEffect(() => {
        if (user) fetchLogs(new Date())
    }, [user, fetchLogs])

    const streak = useMemo(() => calculateStreak(logs), [logs])

    // Hydration mismatch might occur if using new Date() directly during server/client diff.
    const today = format(new Date(), 'EEEE, MMMM do')

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const userInitial = user?.email ? user.email[0].toUpperCase() : '?'

    return (
        <header className="flex h-16 items-center justify-between border-b px-6 bg-white dark:bg-gray-950">
            <div className="flex flex-col">
                <Link href="/app">
                    <h1 className="text-lg font-bold">Sugar Free</h1>
                </Link>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>{today}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 mr-2">
                    {/* Vitality Fire Icon */}
                    <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full font-bold animate-fade-in">
                        <Flame className="w-5 h-5 fill-current animate-pulse" />
                        <span>{streak}</span>
                    </div>

                    {user && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-semibold" title={user.email}>
                            {userInitial}
                        </div>
                    )}
                </div>

                {/* Language Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLanguage(language === 'en' ? 'pt-br' : 'en')}
                    title="Switch Language"
                >
                    <span className="text-xs font-bold">{language?.toUpperCase()}</span>
                </Button>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    )
}
