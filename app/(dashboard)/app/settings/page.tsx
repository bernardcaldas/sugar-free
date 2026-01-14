'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Clock, User, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const { user } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="space-y-6 pb-10">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>

            {/* Profile Section */}
            <section>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p>{user?.email}</p>
                        </div>
                        <div className="pt-2">
                            <p className="text-sm font-medium text-muted-foreground">Member since</p>
                            <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Preferences Section (Visual Only) */}
            <section>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div className="space-y-0.5">
                                <p className="font-medium">Daily Reminder</p>
                                <p className="text-xs text-muted-foreground">Get reminded to log your day</p>
                            </div>
                            <Button variant="outline" size="sm" disabled>10:00 AM</Button>
                        </div>
                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div className="space-y-0.5">
                                <p className="font-medium">Motivational Quotes</p>
                                <p className="text-xs text-muted-foreground">Show quotes on dashboard</p>
                            </div>
                            <Button variant="outline" size="sm" disabled>On</Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                </Button>
            </section>
        </div>
    )
}
