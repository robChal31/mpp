"use client"

import { ArrowRight, PlayCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface HeroSectionProps {
  user: { name: string; email: string; role: string } | null
}

const HeroSection = ({ user }: HeroSectionProps) => {
  const t = useTranslations('hero');
  const userName = user ? user.name : t('userName');

  return (
    <div className="px-6 bg-white md:bg-transparent relative overflow-hidden md:mb-8 mb-6">
      {/* Decorative Elements - Background */}
      {/* <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-primary/5 to-black/1" /> */}

      <div className="max-w-7xl mx-auto relative border-b md:py-8 border-border md:bg-[url(/illustrations/hero-banner.png)] bg-cover bg-no-repeat">


        {/* Desktop: Flex row dengan gambar di kanan */}
        <div className="hidden md:flex flex-row items-center gap-12 relative">
          <div className="md:w-1/2 w-full relative">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {t('welcome')}, <span className="text-foreground italic">{userName}</span>
            </h1>
            
            <div className="w-32 h-1 bg-linear-to-r from-primary to-secondary rounded-full mb-4" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t('title1')}
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t('title2')}
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4 leading-tight">
              {t('title3')}
            </h2>

            <p className="text-black text-base backdrop-blur-lg max-w-lg leading-relaxed mb-8">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href='/benefits' className="btn-sm btn-primary group hover:btn-outline-primary">
                {t('ctaPrimary')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href='/help-center' className="btn-sm btn-outline-secondary group/btn2">
                <PlayCircle className="w-4 h-4 group-hover/btn2:scale-110 group-hover/btn2:-translate-x-1 transition-transform" />
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: Full background image dengan text di atas - pakai gambar yang sama dengan desktop */}
        <div className="md:hidden relative min-h-[60vh] -mx-6">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/illustrations/hero-banner-mobile.png')`,
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/60 to-black/30" />
          </div>

          <div className="relative z-10 min-h-[60vh] flex items-center px-6">
            <div className="w-full">
              <div className="w-12 h-0.5 bg-linear-to-r from-secondary to-white/50 rounded-full mb-4" />
              
              <h1 className="text-xl font-bold text-secondary mb-2 drop-shadow-lg">
                {t('welcome')}, <span className="text-white font-bold">{user?.name || 'User'}</span>
              </h1>
              
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                {t('title1')}
              </h2>
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                {t('title2')}
              </h2>
              <h2 className="text-2xl font-bold text-secondary mb-4 leading-tight drop-shadow-lg">
                {t('title3')}
              </h2>

              <p className="text-white/80 text-sm max-w-lg leading-relaxed mb-6 drop-shadow-md line-clamp-3">
                {t('description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link href='/benefits' className="btn-sm btn-primary group w-full justify-center">
                  <span className="text-sm font-medium">{t('ctaPrimary')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href='/help-center' className="btn-sm btn-outline-secondary group w-full justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30">
                  <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{t('ctaSecondary')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;