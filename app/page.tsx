'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t, language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-br' : 'en')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Minimalista */}
      <header className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <CheckCircle2 className="w-6 h-6" />
          <span>Sugar Free</span>
        </div>
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="font-medium"
          >
            {language === 'en' ? 'PT-BR' : 'EN'}
          </Button>
          <Link href="/login">
            <Button variant="ghost" className="font-medium hover:bg-transparent hover:text-primary transition-colors">
              {t('landing.nav_login')}
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        {/* Hero Section - Split Screen */}
        <section className="w-full px-6 py-12 lg:py-0">
          <div className="container max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

              {/* Coluna Texto (Esquerda) */}
              <div className="flex flex-col space-y-6 text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {t('landing.hero_title_1')} <br className="hidden lg:block" />
                  <span className="text-primary">{t('landing.hero_title_2')}</span>
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 leading-relaxed">
                  {t('landing.hero_subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full h-14 px-8 text-lg rounded-full">
                      {t('landing.cta_button')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Prova Social Minimalista (Texto Simples) */}
                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{t('landing.social_simple')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{t('landing.social_focus')}</span>
                  </div>
                </div>
              </div>

              {/* Coluna Imagem (Direita) - Mockup */}
              <div className="flex justify-center items-center order-1 lg:order-2 relative">
                {/* Elemento decorativo de fundo minimalista */}
                <div className="absolute w-[300px] h-[300px] bg-primary/20 blur-3xl rounded-full -z-10 lg:w-[500px] lg:h-[500px]" />

                <div className="relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]">
                  <Image
                    src="/tela1-portrait.png"
                    alt="App Interface on iPhone"
                    width={800} // Ajustado para manter proporção, mas controlado pelo wrapper CSS
                    height={1600}
                    className="drop-shadow-2xl rounded-[3rem] border-[8px] border-white/10"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer Ultra Simples */}
      <footer className="w-full py-8 border-t mt-auto">
        <div className="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>© 2026 Sugar Free</span>
          </div>

          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-primary transition-colors">{t('landing.footer_terms')}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t('landing.footer_privacy')}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t('landing.footer_instagram')}</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
