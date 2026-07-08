import { useTranslations } from 'next-intl'
import SimpleEventsScroll from '../event/simple-events-scroll'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowRight, CalendarHeart } from 'lucide-react'
import { EventsCTA } from './events-cta'

const FeaturedEvents = () => {
    const t = useTranslations('Dashboard')
    return (
        <div className="bg-white md:bg-primary/2 my-4 py-4 md:px-2 px-4">
            <div id="dashboard-featured-events" className="max-w-6xl mx-auto space-y-6  ">
                
                {/* Header Section - Following image design */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* Left side - Title with line */}
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-primary tracking-widest uppercase">
                                {t('eventLabel')}
                            </p>
                            <div className="w-16 h-0.5 bg-linear-to-r from-primary to-secondary rounded-full"></div>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                            {t('eventTitle1')}
                            <br />
                            {t('eventTitle2')}
                        </h2>
                    </div>
                    
                    {/* Right side - View All Button */}
                    <Link href="/events" className="shrink-0 self-start sm:self-center md:block hidden">
                        <Button variant="link" className="cursor-pointer group gap-2 text-primary hover:text-primary-dark p-0 h-auto font-medium text-sm">
                            <span>{t('viewAllEvents')}</span>
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Events List - Using SimpleEventsScroll */}
                <div id="simple-events-scroll" className="pt-2">
                    <SimpleEventsScroll limit={20} />
                </div>

                {/* CTA Section - "Tertarik dengan event ini?" */}
                <EventsCTA />
            </div>
        </div>
    )
}

export default FeaturedEvents