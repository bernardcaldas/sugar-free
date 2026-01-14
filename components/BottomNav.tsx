'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Star, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        {
            href: '/app',
            label: 'Home',
            icon: Home,
            activeMatch: (path: string) => path === '/app'
        },
        {
            href: '/app/journey',
            label: 'Journey',
            icon: Star,
            activeMatch: (path: string) => path.startsWith('/app/journey')
        },
        {
            href: '/app/settings',
            label: 'Settings',
            icon: Settings,
            activeMatch: (path: string) => path.startsWith('/app/settings')
        }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = item.activeMatch(pathname)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current/10")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
