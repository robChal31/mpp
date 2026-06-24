import { ArrowRight, Calendar, Gift, Rocket, Settings, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

function QuickAction() {
    const t = useTranslations('Dashboard')
    return (
        <div id="dashboard-quick-actions" className="space-y-5 my-10">
            
            {/* Header - clean */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-[#3279FF] to-[#5e93ff] shadow-sm">
                    <Rocket size={18} className="text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('quickActions')}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {t('quickActionsDesc')}
                    </p>
                </div>
            </div>
            
            {/* Action Cards - unified style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Benefit Card */}
                <Link href="/benefits" className="group">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#3279FF]/30 hover:shadow-md transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-[#3279FF]/10 flex items-center justify-center group-hover:bg-[#3279FF]/20 transition-colors">
                            <Gift size={18} className="text-[#3279FF]" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{t('claimBenefits')}</p>
                            <p className="text-xs text-gray-500">{t('claimBenefitsDesc')}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-[#3279FF] group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
                
                {/* Event Card */}
                <Link href="/events" className="group">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#FFB347]/30 hover:shadow-md transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-[#FFB347]/10 flex items-center justify-center group-hover:bg-[#FFB347]/20 transition-colors">
                            <Calendar size={18} className="text-[#FFB347]" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{t('browseEventsShort')}</p>
                            <p className="text-xs text-gray-500">{t('browseEventsDesc')}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-[#FFB347] group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
                
                {/* Settings Card - pakai warna primary juga biar unified */}
                <Link href="/settings" className="group">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#3279FF]/30 hover:shadow-md transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-[#3279FF]/10 flex items-center justify-center group-hover:bg-[#3279FF]/20 transition-colors">
                            <Settings size={18} className="text-[#3279FF]" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{t('accountSettings')}</p>
                            <p className="text-xs text-gray-500">{t('accountSettingsDesc')}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-[#3279FF] group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
                
            </div>
        </div>
    )
}

export default QuickAction