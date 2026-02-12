"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Target, TrendingDown } from "lucide-react";

interface RelapseAnalysisProps {
    data: {
        trigger: string;
        percentage: number;
        advice: string;
    } | null;
}

export function RelapseAnalysisCard({ data }: RelapseAnalysisProps) {
    if (!data) return null;

    const hasData = data.trigger !== "Dados insuficientes" && data.percentage > 0;

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 via-white to-amber-50/50 dark:from-orange-950/40 dark:via-gray-950 dark:to-amber-950/20">
            {/* Decorative bg element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 dark:bg-orange-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                        <Target className="h-4 w-4" />
                    </div>
                    Ponto de Atenção
                </CardTitle>
                {hasData && (
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                        <TrendingDown className="h-3 w-3" />
                        {data.percentage}%
                    </div>
                )}
            </CardHeader>
            <CardContent className="relative space-y-3">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                    {data.trigger}
                </div>

                {hasData && (
                    <div className="w-full bg-orange-100 dark:bg-orange-900/20 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(data.percentage, 100)}%` }}
                        />
                    </div>
                )}

                <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-3.5 rounded-xl border border-orange-100/80 dark:border-orange-800/20">
                    <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {data.advice}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
