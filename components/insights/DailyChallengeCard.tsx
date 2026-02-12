"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trophy, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

interface DailyChallengeProps {
    data: {
        title: string;
        description: string;
        id: string;
    } | null;
}

export function DailyChallengeCard({ data }: DailyChallengeProps) {
    const [completed, setCompleted] = useState(false);

    if (!data) return null;

    const handleComplete = () => {
        if (completed) return;

        setCompleted(true);
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#a855f7", "#6366f1", "#ec4899", "#f59e0b"],
        });
        toast.success("🏆 Desafio completo! +50 XP", {
            style: {
                background: "#7c3aed",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: "600",
            },
        });
    };

    return (
        <Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${completed
            ? "from-emerald-50 via-white to-green-50/50 dark:from-emerald-950/40 dark:via-gray-950 dark:to-green-950/20"
            : "from-violet-50 via-white to-fuchsia-50/50 dark:from-violet-950/40 dark:via-gray-950 dark:to-fuchsia-950/20"
            }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${completed ? "bg-emerald-100/50 dark:bg-emerald-900/10" : "bg-violet-100/50 dark:bg-violet-900/10"
                }`} />

            <CardHeader className="relative pb-2">
                <CardTitle className={`text-sm font-semibold flex items-center justify-between ${completed ? "text-emerald-700 dark:text-emerald-400" : "text-violet-700 dark:text-violet-400"
                    }`}>
                    <span className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${completed ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-violet-100 dark:bg-violet-900/40"}`}>
                            <Trophy className="h-4 w-4" />
                        </div>
                        Desafio do Dia
                    </span>
                    {completed && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            CONCLUÍDO
                        </span>
                    )}
                    {!completed && (
                        <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-900/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            +50 XP
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{data.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {data.description}
                </p>

                <Button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`w-full h-11 font-semibold rounded-xl transition-all duration-300 ${completed
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                        : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-violet-200 hover:shadow-lg"
                        }`}
                >
                    {completed ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Completado!
                        </>
                    ) : (
                        <>
                            <Zap className="mr-2 h-4 w-4" />
                            Aceitar Desafio
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
