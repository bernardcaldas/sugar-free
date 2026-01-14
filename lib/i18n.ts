export type Language = 'en' | 'pt-br'

export const translations = {
    en: {
        common: {
            yes: 'Yes',
            no: 'No',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            loading: 'Loading...',
            today: 'Today',
            tomorrow: 'Tomorrow',
            days: 'days',
        },
        landing: {
            hero_title_1: 'Track your sugar-free journey',
            hero_title_2: 'Simplify your life.',
            hero_subtitle: 'No complex spreadsheets. No judgments. Just a simple log to build healthy habits, one day at a time.',
            cta_button: 'Get Started',
            social_simple: 'Simple to use',
            social_focus: 'Focus on progress',
            nav_login: 'Login',
            footer_terms: 'Terms',
            footer_privacy: 'Privacy',
            footer_instagram: 'Instagram',
        },
        nav: {
            home: 'Home',
            journey: 'Journey',
            settings: 'Settings',
        },
        header: {
            logout: 'Log Out',
        },
        home: {
            today_title: 'Today',
            history_title: 'History',
            action_card_title: 'Did you stay sugar-free today?',
            action_card_subtitle: 'Tap to log your progress',
            tap_to_confirm: 'Tap again to confirm',
            yes_button: 'Yes!',
            no_button: 'No',
            stats: {
                current_streak: 'Current Streak',
                month_success: 'Month Success',
            },
        },
        journey: {
            title: 'Your Journey',
            subtitle: 'Keep going! Every sugar-free day counts.',
            next_reward: {
                title: 'Next Reward',
                days_left: 'days left',
                unlocked: 'Unlocked',
                completed: 'All milestones completed!',
            },
            sugar_ticket: {
                title: 'Sugar Ticket',
                available: 'One planned free meal.',
                locked_phase1: 'Unlocked after 10 consecutive days.',
                locked_phase2: 'Planned flexibility.',
                plan_button: 'Plan My Flex Meal',
                context_available: "You've earned a flex option. Use it wisely for a single planned occasion.",
                context_locked: '"Autocontrol is knowing when."',
                quote_planning: '"Planning beats impulsive eating."',
                quote_control: '"Control is choosing, not avoiding forever."',
                dialog_title: 'Plan Sugar Ticket',
                dialog_desc: 'Select a date for your planned exception.',
            }
        },
        settings: {
            title: 'Settings',
            theme: 'Theme',
            language: 'Language',
            profile: 'Profile',
            preferences: 'Preferences',
            notifications: 'Notifications',
            member_since: 'Member since'
        },
        milestones: {
            3: {
                title: 'Initial Reset',
                body: 'Less bloating and sugar spikes',
                mind: 'First sense of control'
            },
            7: {
                title: 'Stabilization',
                body: 'More constant energy',
                mind: 'Less craving for sweets'
            },
            10: {
                title: 'Active Palate',
                body: 'More sensitive palate',
                mind: 'Less search for immediate reward'
            },
            15: {
                title: 'Physical Control',
                body: 'Regulated appetite',
                mind: 'Less food anxiety'
            },
            21: {
                title: 'Metabolic Balance',
                body: 'Stable energy all day',
                mind: 'Sustained focus'
            },
            30: {
                title: 'New Standard',
                body: 'Consolidated habit',
                mind: 'Food autonomy'
            }
        }
    },
    'pt-br': {
        common: {
            yes: 'Sim',
            no: 'Não',
            save: 'Salvar',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            loading: 'Carregando...',
            today: 'Hoje',
            tomorrow: 'Amanhã',
            days: 'dias',
        },
        landing: {
            hero_title_1: 'Controle seu açúcar.',
            hero_title_2: 'Simplifique sua vida.',
            hero_subtitle: 'Sem planilhas complexas. Sem julgamentos. Apenas um registro simples para construir hábitos saudáveis, um dia de cada vez.',
            cta_button: 'Começar Agora',
            social_simple: 'Simples de usar',
            social_focus: 'Foco no progresso',
            nav_login: 'Entrar',
            footer_terms: 'Termos',
            footer_privacy: 'Privacidade',
            footer_instagram: 'Instagram',
        },
        nav: {
            home: 'Início',
            journey: 'Jornada',
            settings: 'Ajustes',
        },
        header: {
            logout: 'Sair',
        },
        home: {
            today_title: 'Hoje',
            history_title: 'Histórico',
            action_card_title: 'Você ficou sem açúcar hoje?',
            action_card_subtitle: 'Toque para registrar',
            tap_to_confirm: 'Toque novamente para confirmar',
            yes_button: 'Sim!',
            no_button: 'Não',
            stats: {
                current_streak: 'Sequência Atual',
                month_success: 'Sucesso no Mês',
            },
        },
        journey: {
            title: 'Sua Jornada',
            subtitle: 'Continue assim! Cada dia conta.',
            next_reward: {
                title: 'Próxima Recompensa',
                days_left: 'dias restantes',
                days_label: 'dias',
                unlocked: 'Desbloqueado',
                completed_title: 'Todas as conquistas alcançadas!',
                completed_subtitle: 'Você é uma lenda. Continue assim!',
            },
            sugar_ticket: {
                title: 'Vale Refeição Livre',
                available: 'Uma refeição livre planejada.',
                locked_phase1: 'Desbloqueado após 10 dias seguidos.',
                locked_phase2: 'Flexibilidade planejada.',
                plan_button: 'Planejar Refeição',
                context_available: "Você ganhou uma opção flexível. Use com sabedoria para uma ocasião planejada.",
                context_locked: '"Autocontrole é saber quando."',
                quote_planning: '"Planejar é melhor que agir por impulso."',
                quote_control: '"Controle é escolher, não evitar para sempre."',
                dialog_title: 'Planejar Vale Refeição',
                dialog_desc: 'Escolha uma data para sua exceção planejada.',
            }
        },
        settings: {
            title: 'Configurações',
            theme: 'Tema',
            language: 'Idioma',
            profile: 'Perfil',
            preferences: 'Preferências',
            notifications: 'Notificações',
            member_since: 'Membro desde'
        },
        milestones: {
            3: {
                title: 'Reset Inicial',
                body: 'Menos inchaço e picos de açúcar',
                mind: 'Primeira sensação de controle'
            },
            7: {
                title: 'Estabilização',
                body: 'Energia mais constante',
                mind: 'Menos desejo por doce'
            },
            10: {
                title: 'Paladar Ativo',
                body: 'Paladar mais sensível',
                mind: 'Menos busca por recompensa imediata'
            },
            15: {
                title: 'Controle Físico',
                body: 'Apetite regulado',
                mind: 'Menos ansiedade alimentar'
            },
            21: {
                title: 'Equilíbrio Metabólico',
                body: 'Energia estável o dia todo',
                mind: 'Foco sustentado'
            },
            30: {
                title: 'Novo Padrão',
                body: 'Hábito consolidado',
                mind: 'Autonomia alimentar'
            }
        }
    }
}
