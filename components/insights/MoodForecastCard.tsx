"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

interface MoodForecastProps {
    data: {
        prediction: string;
        daysToPeak: number;
        comparableUserGroup: string;
    } | null;
}

export function MoodForecastCard({ data }: MoodForecastProps) {
    if (!data) return null;

    const progress = Math.max(10, 100 - (data.daysToPeak * 15));

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-cyan-50/50 dark:from-blue-950/40 dark:via-gray-950 dark:to-cyan-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    Previsão de Bem-Estar
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="relative space-y-4">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-50 leading-snug capitalize">
                    {data.prediction}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {data.comparableUserGroup}
                </p>

                {/* Progress towards peak */}
                <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-3.5 rounded-xl border border-blue-100/80 dark:border-blue-800/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Progresso</span>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {data.daysToPeak} {data.daysToPeak === 1 ? "dia" : "dias"}
                        </span>
                    </div>
                    <div className="h-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
