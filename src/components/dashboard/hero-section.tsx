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
    <div className="md:pt-8 px-6 bg-white md:bg-transparent relative overflow-hidden md:mb-8 mb-6">
      {/* Decorative Elements - Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative border-b border-border md:py-4">
        {/* Decorative Line - Top Right Corner */}
        <div className="absolute -top-4 right-0 opacity-20 hidden lg:block">
          <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
            <path 
              d="M0 0 L200 0 L200 80" 
              stroke="#97262C" 
              strokeWidth="2"
            />
            <path 
              d="M180 0 L180 60" 
              stroke="#FF9025" 
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Decorative Lines - Left Side Vertical */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-15 hidden xl:block">
          <svg width="40" height="280" viewBox="0 0 40 280" fill="none">
            <line x1="20" y1="0" x2="20" y2="280" stroke="#97262C" strokeWidth="1.5" strokeDasharray="6 8"/>
            <line x1="30" y1="40" x2="30" y2="240" stroke="#FF9025" strokeWidth="1" strokeDasharray="4 8"/>
            <circle cx="20" cy="20" r="3" fill="#97262C" opacity="0.4"/>
            <circle cx="20" cy="260" r="3" fill="#FF9025" opacity="0.4"/>
          </svg>
        </div>

        {/* Decorative Line - Bottom Left */}
        {/* <div className="absolute bottom-0 left-20 opacity-10 hidden lg:block">
          <svg width="160" height="60" viewBox="0 0 160 60" fill="none">
            <path 
              d="M0 30 L80 30 L120 60" 
              stroke="#97262C" 
              strokeWidth="1.5"
            />
            <path 
              d="M40 30 L100 30 L140 60" 
              stroke="#FF9025" 
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          </svg>
        </div> */}

        {/* Desktop: Flex row dengan gambar di kanan */}
        <div className="hidden md:flex flex-row items-center gap-12 relative">
          {/* Left Side - Text Content */}
          <div className="flex-1 relative">
            {/* Decorative small line before title */}
            {/* <div className="absolute -left-6 top-4 w-4 h-0.5 bg-secondary rounded-full"></div> */}
            
            {/* SELAMAT DATANG */}
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {t('welcome')}, <span className="text-foreground italic">{userName}</span>
            </h1>
            
            {/* Decorative underline */}
            <div className="w-12 h-0.5 bg-linear-to-r from-primary to-secondary rounded-full mb-4"></div>
            
            {/* Kelola Manfaat */}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t('title1')}
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t('title2')}
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {t('title3')}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-base max-w-lg leading-relaxed mb-8">
              {t('description')}
            </p>

            {/* CTA Buttons with icons */}
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

            {/* Decorative small lines - bottom */}
            {/* <div className="absolute -bottom-2 left-32 opacity-20 hidden xl:block">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <line x1="0" y1="10" x2="20" y2="10" stroke="#97262C" strokeWidth="1.5"/>
                <line x1="25" y1="10" x2="45" y2="10" stroke="#FF9025" strokeWidth="1.5" strokeDasharray="3 4"/>
                <circle cx="55" cy="10" r="2" fill="#97262C" opacity="0.3"/>
              </svg>
            </div> */}
          </div>

          {/* Right Side - Image with subtle blending */}
          <div className="flex-1 relative">
            {/* Decorative corner brackets */}
            <div className="absolute -top-4 -right-4 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M0 0 L40 0 M0 0 L0 40" stroke="#97262C" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-4 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M40 40 L0 40 M40 40 L40 0" stroke="#FF9025" strokeWidth="1.5"/>
              </svg>
            </div>

            {/* Decorative parallel lines behind image */}
            <div className="absolute -top-8 -right-8 opacity-10">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <line x1="20" y1="0" x2="20" y2="120" stroke="#97262C" strokeWidth="1" strokeDasharray="4 6"/>
                <line x1="40" y1="0" x2="40" y2="120" stroke="#97262C" strokeWidth="1" strokeDasharray="4 6"/>
                <line x1="60" y1="0" x2="60" y2="120" stroke="#97262C" strokeWidth="1" strokeDasharray="4 6"/>
              </svg>
            </div>
            
            <div className="absolute inset-0 bg-linear-to-r from-white via-white/30 to-transparent z-10"></div>
            <div className="w-full h-96 rounded-lg overflow-hidden relative">
              <img 
                src="/illustrations/hero3.png" 
                alt={t('imageAlt')}
                className="w-full h-full object-contain"
              />
            </div>

          </div>
        </div>

        {/* Mobile: Full background image dengan text di atas */}
        <div className="md:hidden relative min-h-[65vh] -mx-6">
          {/* Background Image with subtle overlay */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/illustrations/hero3.png')`,
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-black/50 to-black/30"></div>
          </div>

          {/* Content - Text di atas gambar */}
          <div className="relative z-10 min-h-[65vh] flex items-center px-6">
            <div className="w-full backdrop-blur-none">
              {/* Decorative line - mobile */}
              <div className="w-8 h-0.5 bg-linear-to-r from-secondary to-white rounded-full mb-4"></div>
              
              {/* SELAMAT DATANG */}
              <h1 className="text-xl font-bold text-primary mb-2 drop-shadow-lg">
                {t('welcome')}, <span className="text-white">{'Frank'}</span>
              </h1>
              
              {/* Kelola Manfaat */}
              <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-lg">
                {t('title1')}
              </h2>
              <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-lg">
                {t('title2')}
              </h2>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {t('title3')}
              </h2>

              {/* Description */}
              <p className="text-white/70 text-sm max-w-lg leading-relaxed mb-8 drop-shadow-md">
                {t('description')}
              </p>

              {/* CTA Buttons with icons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-sm btn-primary group">
                  <span className="text-xs">{t('ctaPrimary')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn-sm btn-outline-secondary group">
                  <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{t('ctaSecondary')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;