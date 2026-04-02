'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Star, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

export function BottomNav() {
    const pathname = usePathname()
    const { t } = useLanguage()

    const navItems = [
        {
            href: '/app',
            label: t('nav.home'),
            icon: Home,
            activeMatch: (path: string) => path === '/app'
        },
        {
            href: '/app/journey',
            label: t('nav.journey'),
            icon: Star,
            activeMatch: (path: string) => path.startsWith('/app/journey')
        },
        {
            href: '/app/insights',
            label: t('nav.insights'),
            icon: Sparkles,
            activeMatch: (path: string) => path.startsWith('/app/insights')
        },
        {
            href: '/app/settings',
            label: t('nav.settings'),
            icon: Settings,
            activeMatch: (path: string) => path.startsWith('/app/settings')
        }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe md:hidden">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = item.activeMatch(pathname)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {/* Active indicator — subtle dot */}
                            {isActive && (
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
