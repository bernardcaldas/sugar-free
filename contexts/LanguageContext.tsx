'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from '@/lib/i18n'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper to validate language
const isValidLanguage = (lang: any): lang is Language => {
    return lang === 'en' || lang === 'pt-br'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    // Load from local storage with validation
    useEffect(() => {
        const saved = localStorage.getItem('app-language')
        if (isValidLanguage(saved)) {
            setLanguage(saved)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        if (!isValidLanguage(lang)) return
        setLanguage(lang)
        localStorage.setItem('app-language', lang)
    }

    // Helper to access nested keys like 'home.title'
    const t = (path: string) => {
        // Safe access to translation object
        const currentLang = isValidLanguage(language) ? language : 'en'
        const langData = translations[currentLang]

        if (!langData) return path

        const keys = path.split('.')
        let current: any = langData

        for (const key of keys) {
            if (current === undefined || current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`)
                return path
            }
            current = current[key]
        }
        return current
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
