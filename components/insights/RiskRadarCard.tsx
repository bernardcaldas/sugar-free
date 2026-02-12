"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RiskRadarProps {
    data: {
        riskLevel: "LOW" | "MEDIUM" | "HIGH";
        dayOfWeek: string;
        message: string;
    } | null;
}

export function RiskRadarCard({ data }: RiskRadarProps) {
    if (!data) return null;

    const riskConfig = {
        LOW: {
            gradient: "from-emerald-50 via-white to-green-50/50 dark:from-emerald-950/40 dark:via-gray-950 dark:to-green-950/20",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
            textColor: "text-emerald-700 dark:text-emerald-400",
            badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
            decoration: "bg-emerald-100/50 dark:bg-emerald-900/10",
            barColor: "from-emerald-400 to-green-500",
            barWidth: "33%",
            icon: ShieldCheck,
            statusIcon: CheckCircle2,
            label: "Seguro",
        },
        MEDIUM: {
            gradient: "from-amber-50 via-white to-yellow-50/50 dark:from-amber-950/40 dark:via-gray-950 dark:to-yellow-950/20",
            iconBg: "bg-amber-100 dark:bg-amber-900/40",
            textColor: "text-amber-700 dark:text-amber-400",
            badgeBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
            decoration: "bg-amber-100/50 dark:bg-amber-900/10",
            barColor: "from-amber-400 to-yellow-500",
            barWidth: "66%",
            icon: Shield,
            statusIcon: AlertTriangle,
            label: "Atenção",
        },
        HIGH: {
            gradient: "from-red-50 via-white to-rose-50/50 dark:from-red-950/40 dark:via-gray-950 dark:to-rose-950/20",
            iconBg: "bg-red-100 dark:bg-red-900/40",
            textColor: "text-red-700 dark:text-red-400",
            badgeBg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
            decoration: "bg-red-100/50 dark:bg-red-900/10",
            barColor: "from-red-400 to-rose-500",
            barWidth: "100%",
            icon: ShieldAlert,
            statusIcon: ShieldAlert,
            label: "Alto Risco",
        },
    };

    const config = riskConfig[data.riskLevel] || riskConfig.LOW;
    const Icon = config.icon;
    const StatusIcon = config.statusIcon;

    return (
        <Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${config.gradient}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${config.decoration} rounded-full -translate-y-1/2 translate-x-1/2`} />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className={`text-sm font-semibold ${config.textColor} flex items-center gap-2`}>
                    <div className={`p-1.5 ${config.iconBg} rounded-lg`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    Radar de Segurança
                </CardTitle>
                <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${config.badgeBg}`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                </div>
            </CardHeader>
            <CardContent className="relative space-y-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-50 capitalize">
                        {data.dayOfWeek}
                    </span>
                    <span className="text-xs text-gray-400">— dia mais crítico</span>
                </div>

                {/* Risk bar */}
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${config.barColor} rounded-full transition-all duration-1000`}
                        style={{ width: config.barWidth }}
                    />
                </div>

                <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-3.5 rounded-xl border border-gray-100/80 dark:border-gray-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {data.message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
