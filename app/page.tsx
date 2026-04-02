'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t, language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-br' : 'en')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Header — borderless on landing */}
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-base tracking-tight text-foreground">Sugar Free</span>
        </div>
        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {language === 'en' ? 'PT-BR' : 'EN'}
          </Button>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              {t('landing.nav_login')}
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">

        {/* Hero — Massive Typography */}
        <section className="w-full px-6 pt-16 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-24">
          <div className="max-w-7xl mx-auto">

            {/* Pre-title label */}
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary mb-10">
              Health · Clarity · Progress
            </p>

            {/* Massive Headline */}
            <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-[0.92] tracking-tight text-foreground mb-8">
              {t('landing.hero_title_1')}<br />
              <span className="text-primary">{t('landing.hero_title_2')}</span>
            </h1>

            {/* Horizontal divider */}
            <div className="w-10 h-[2px] bg-primary mb-10" />

            {/* Subtitle + CTA */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-20">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xs">
                {t('landing.hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Link href="/login">
                  <Button size="lg" className="h-11 px-8 text-sm font-semibold rounded-lg">
                    {t('landing.cta_button')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>{t('landing.social_simple')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>{t('landing.social_focus')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section className="w-full px-6 py-10 border-y border-border">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{t('landing.social_simple')}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landing.hero_subtitle')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{t('landing.social_focus')}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landing.hero_subtitle')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{t('landing.cta_button')}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landing.hero_subtitle')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* App Mockup — centered, clean shadow */}
        <section className="w-full px-6 py-20 md:py-28">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
              The App
            </p>
            <div className="relative w-[220px] sm:w-[260px] md:w-[300px]">
              <Image
                src="/tela1-portrait.png"
                alt="Sugar Free App interface"
                width={800}
                height={1600}
                className="rounded-[2.5rem] border border-border shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

      </main>

      {/* Footer ultra-minimal */}
      <footer className="w-full py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 rounded bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
            </div>
            <span>© 2026 Sugar Free</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">{t('landing.footer_terms')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('landing.footer_privacy')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('landing.footer_instagram')}</Link>
          </nav>
        </div>
      </footer>

    </div>
  )
}
