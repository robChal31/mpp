import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

const Hero = () => {
    const t = useTranslations('Dashboard')
    return (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#3279FF]/5 via-white to-[#FFB347]/5 dark:from-[#3279FF]/10 dark:via-gray-900 dark:to-[#FFB347]/10 shadow-xl">
        
            {/* Decorative colorful blobs */}
            <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-[#3279FF]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-56 h-56 md:w-80 md:h-80 bg-[#FFB347]/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-pink-200/20 rounded-full blur-3xl" />
            
            {/* Cartoon stars decoration - hidden di mobile */}
            <div className="absolute top-5 left-[10%] text-xl md:text-2xl animate-bounce-slow hidden sm:block">⭐</div>
            <div className="absolute top-10 right-[10%] text-2xl md:text-3xl animate-spin-slow hidden sm:block">✨</div>
            <div className="absolute bottom-10 left-[8%] text-xl md:text-2xl animate-bounce-slow hidden sm:block">🌟</div>
            <div className="absolute bottom-16 right-[8%] text-lg md:text-xl animate-pulse-slow hidden sm:block">🎈</div>
            
            {/* Main Content */}
            <div className="relative z-10 px-4 py-8 md:px-8 lg:px-12 md:py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-12">
                
                {/* Left Side - Teks */}
                <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
                    
                    {/* Badge cartoon */}
                    <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#3279FF] text-white text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-lg transform -rotate-2">
                        <Sparkles size={12} className="md:w-4 md:h-4 text-[#FFB347]" />
                        <span>🎉 {t('heroBadge')}</span>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-5 leading-tight">
                        {t('heroTitle')}
                        <span className="text-[#3279FF] dark:text-[#5e93ff] bg-[#3279FF]/10 dark:bg-[#5e93ff]/20 px-2 md:px-3 py-0.5 md:py-1 inline-block rounded-xl md:rounded-2xl mt-1 md:mt-2 transform rotate-1 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                            {t('heroTitleHighlight')}
                        </span>
                    </h1>
                    
                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 mb-6 md:mb-8 leading-relaxed">
                        {t('heroDescription')}
                    </p>
                    
                    {/* CTA Buttons */}
                    {/* <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 mb-8 md:mb-10">
                        <Link href="/benefits" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3279FF] to-[#5e93ff] hover:from-[#2b66d9] hover:to-[#3279FF] text-white px-5 md:px-7 py-3 md:py-4 rounded-xl md:rounded-2xl gap-2 md:gap-3 text-sm md:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <Gift size={16} className="md:w-5 md:h-5" />
                            {t('viewBenefits')}
                            <ArrowRight size={14} className="md:w-4 md:h-4" />
                            </Button>
                        </Link>
                        
                        <Link href="/events" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto border-2 border-[#3279FF]/30 text-[#3279FF] hover:bg-[#3279FF]/5 px-5 md:px-7 py-3 md:py-4 rounded-xl md:rounded-2xl gap-2 md:gap-3 text-sm md:text-base font-bold transition-all duration-300 hover:-translate-y-1">
                            <Calendar size={16} className="md:w-5 md:h-5" />
                            {t('viewEvents')}
                            </Button>
                        </Link>
                    </div> */}
                    
                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-6 pt-2 md:pt-4">
                        <div className="flex items-center gap-2 md:gap-3 bg-white/50 dark:bg-gray-800/50 rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#3279FF]/20 flex items-center justify-center text-lg md:text-2xl">🎁</div>
                            <div><p className="text-base md:text-xl font-bold text-gray-900 dark:text-white">24</p><p className="text-[10px] md:text-xs text-gray-500">Benefit</p></div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 bg-white/50 dark:bg-gray-800/50 rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#FFB347]/20 flex items-center justify-center text-lg md:text-2xl">📅</div>
                            <div><p className="text-base md:text-xl font-bold text-gray-900 dark:text-white">12</p><p className="text-[10px] md:text-xs text-gray-500">Event</p></div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 bg-white/50 dark:bg-gray-800/50 rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg md:text-2xl">🤝</div>
                            <div><p className="text-base md:text-xl font-bold text-gray-900 dark:text-white">3</p><p className="text-[10px] md:text-xs text-gray-500">Tahun</p></div>
                        </div>
                    </div>
                    
                </div>
                
                {/* Right Side - GIF Illustration - SAMA PERSIS UKURAN DENGAN LEFT SIDE */}
                <div className="flex-1 flex justify-center items-center mt-6 lg:mt-0">
                    <div className="relative">
                        {/* Decorative rings */}
                        <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-full h-full border-2 md:border-4 border-[#FFB347]/30 rounded-2xl md:rounded-3xl -z-10" />
                        <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-full h-full border-2 md:border-4 border-[#3279FF]/30 rounded-2xl md:rounded-3xl -z-10" />
                        
                        {/* Main GIF */}
                        <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-95 lg:h-95 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white">
                            <img
                            src="/gif1.gif"
                            alt="Cartoon illustration"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Floating stickers */}
                        <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-10 h-10 md:w-16 md:h-16 bg-[#FFB347] rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                            <span className="text-xl md:text-3xl">🎉</span>
                        </div>
                        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-9 h-9 md:w-14 md:h-14 bg-[#3279FF] rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                            <span className="text-lg md:text-2xl">⭐</span>
                        </div>
                        <div className="absolute top-1/2 -right-6 md:-right-10 w-8 h-8 md:w-10 md:h-10 bg-pink-400 rounded-full flex items-center justify-center shadow-md sm:flex">
                            <span className="text-base md:text-xl">💡</span>
                        </div>
                        <div className="absolute bottom-1/2 -left-6 md:-left-10 w-8 h-8 md:w-10 md:h-10 bg-green-400 rounded-full flex items-center justify-center shadow-md sm:flex">
                            <span className="text-base md:text-xl">🚀</span>
                        </div>
                        </div>
                    </div>
                
                </div>
            </div>
            
            {/* Bottom wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 opacity-50">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative h-6 md:h-10 w-full">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white dark:fill-gray-900 opacity-40"></path>
                </svg>
            </div>
        
        </div>
    )
}

export default Hero