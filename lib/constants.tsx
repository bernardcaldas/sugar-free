import { Zap, CheckCircle, Brain, Trophy } from 'lucide-react'

export interface Milestone {
    days: number
    title: string
    bodyBenefit: string
    mindBenefit: string
    icon: React.ReactNode
}

export const MILESTONES: Milestone[] = [
    {
        days: 3,
        title: 'Reset Inicial',
        bodyBenefit: 'Menos inchaço e picos de açúcar',
        mindBenefit: 'Primeira sensação de controle',
        icon: <Zap className="h-5 w-5" />
    },
    {
        days: 7,
        title: 'Estabilização',
        bodyBenefit: 'Energia mais constante',
        mindBenefit: 'Menos desejo por doce',
        icon: <CheckCircle className="h-5 w-5" />
    },
    {
        days: 10,
        title: 'Paladar Ativo',
        bodyBenefit: 'Paladar mais sensível',
        mindBenefit: 'Menos busca por recompensa imediata',
        icon: <Zap className="h-5 w-5" />
    },
    {
        days: 15,
        title: 'Controle Físico',
        bodyBenefit: 'Apetite regulado',
        mindBenefit: 'Menos ansiedade alimentar',
        icon: <Brain className="h-5 w-5" />
    },
    {
        days: 21,
        title: 'Equilíbrio Metabólico',
        bodyBenefit: 'Energia estável o dia todo',
        mindBenefit: 'Foco sustentado',
        icon: <Zap className="h-5 w-5" />
    },
    {
        days: 30,
        title: 'Novo Padrão',
        bodyBenefit: 'Hábito consolidado',
        mindBenefit: 'Autonomia alimentar',
        icon: <Trophy className="h-5 w-5" />
    }
]
