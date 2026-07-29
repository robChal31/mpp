// src/app/(main)/tutorial/page.tsx
'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Play,
  Video,
  Clock,
  LogIn,
  Gift,
  Calendar,
  FileText,
  User,
  PlayCircle,
  ChevronRight,
  X,
  HelpCircle,
  MessageCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
  Clock as ClockIcon,
  CircleHelp,
  Headset
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface VideoTutorial {
  id: string
  title: string
  description: string
  category: 'access' | 'benefits' | 'events' | 'programs' | 'account'
  duration: string
  thumbnail: string
  videoUrl: string
  videoId: string
}

interface FAQData {
  id: string
  questionKey: string
  answerKey: string
  category: 'general' | 'account' | 'benefits' | 'events' | 'programs'
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'account' | 'benefits' | 'events' | 'programs'
}

const tutorialData: VideoTutorial[] = [
  { id: '1', title: 'Cara Login ke Platform', description: 'Panduan login menggunakan email dan password yang sudah terdaftar.', category: 'access', duration: '2:30', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '2', title: 'Cara Reset Password (Belum Login)', description: 'Lupa password? Ikuti panduan reset password melalui halaman login.', category: 'access', duration: '3:00', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '3', title: 'Cara Ganti Password (Sudah Login)', description: 'Ganti password akun Anda melalui menu pengaturan setelah login.', category: 'access', duration: '2:15', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '4', title: 'Cara Logout dari Platform', description: 'Keluar dari akun dengan aman melalui menu profil.', category: 'access', duration: '1:30', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '5', title: 'Cara Melihat Benefit Tersedia', description: 'Lihat daftar benefit yang tersedia untuk sekolah Anda.', category: 'benefits', duration: '2:15', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '6', title: 'Cara Mengklaim Benefit', description: 'Panduan lengkap mengklaim benefit dari program kemitraan.', category: 'benefits', duration: '4:20', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '7', title: 'Cara Melihat Event yang Tersedia', description: 'Temukan event-event menarik untuk mitra Mentari.', category: 'events', duration: '2:45', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '8', title: 'Cara Mendaftar Event', description: 'Panduan mendaftar event dan mengisi data peserta.', category: 'events', duration: '5:00', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '9', title: 'Cara Melihat Program & Dokumen', description: 'Akses dan lihat dokumen program kemitraan Anda.', category: 'programs', duration: '2:30', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
  { id: '10', title: 'Cara Mengelola Akun Sekolah', description: 'Kelola profil dan informasi akun sekolah Anda.', category: 'account', duration: '2:00', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/k4wRpxdgo6o', videoId: 'k4wRpxdgo6o' },
]

const faqData: FAQData[] = [
  { id: '1', questionKey: 'faq.whatIsMentari.question', answerKey: 'faq.whatIsMentari.answer', category: 'general' },
  { id: '2', questionKey: 'faq.whoIsPIC.question', answerKey: 'faq.whoIsPIC.answer', category: 'general' },
  { id: '3', questionKey: 'faq.getHelp.question', answerKey: 'faq.getHelp.answer', category: 'general' },
  { id: '4', questionKey: 'faq.login.question', answerKey: 'faq.login.answer', category: 'account' },
  { id: '5', questionKey: 'faq.resetPassword.question', answerKey: 'faq.resetPassword.answer', category: 'account' },
  { id: '6', questionKey: 'faq.claimBenefit.question', answerKey: 'faq.claimBenefit.answer', category: 'benefits' },
  { id: '7', questionKey: 'faq.availableBenefits.question', answerKey: 'faq.availableBenefits.answer', category: 'benefits' },
  { id: '8', questionKey: 'faq.registerEvent.question', answerKey: 'faq.registerEvent.answer', category: 'events' },
  { id: '9', questionKey: 'faq.viewPrograms.question', answerKey: 'faq.viewPrograms.answer', category: 'programs' },
  { id: '10', questionKey: 'faq.manageAccount.question', answerKey: 'faq.manageAccount.answer', category: 'account' },
  { id: '11', questionKey: 'faq.contactSupport.question', answerKey: 'faq.contactSupport.answer', category: 'general' },
  { id: '12', questionKey: 'faq.programDuration.question', answerKey: 'faq.programDuration.answer', category: 'programs' },
  { id: '13', questionKey: 'faq.eventFee.question', answerKey: 'faq.eventFee.answer', category: 'events' },
  { id: '14', questionKey: 'faq.viewBenefits.question', answerKey: 'faq.viewBenefits.answer', category: 'benefits' },
]

// categoryConfig - TETAP (tidak berubah)
const categoryConfig = {
  'access': { 
    labelKey: 'category.access', 
    icon: LogIn, 
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  'benefits': { 
    labelKey: 'category.benefits', 
    icon: Gift, 
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20'
  },
  'events': { 
    labelKey: 'category.events', 
    icon: Calendar, 
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20'
  },
  'programs': { 
    labelKey: 'category.programs', 
    icon: FileText, 
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  'account': { 
    labelKey: 'category.account', 
    icon: User, 
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  }
}

// faqCategoryConfig - TETAP (tidak berubah)
const faqCategoryConfig = {
  'general': { labelKey: 'faqCategory.general', icon: HelpCircle },
  'account': { labelKey: 'faqCategory.account', icon: User },
  'benefits': { labelKey: 'faqCategory.benefits', icon: Gift },
  'events': { labelKey: 'faqCategory.events', icon: Calendar },
  'programs': { labelKey: 'faqCategory.programs', icon: FileText }
}

export default function TutorialPage() {
  const t = useTranslations('Tutorial')
  const [selectedCategory, setSelectedCategory] = useState<string>('access')
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(tutorialData[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [faqCategory, setFaqCategory] = useState<string>('all')
  const [showAllFaq, setShowAllFaq] = useState(false)

  const filteredVideos = tutorialData.filter(v => v.category === selectedCategory)
  
  // Build FAQ items with translations
  const faqItems: FAQItem[] = faqData.map(item => ({
    id: item.id,
    category: item.category,
    question: t(item.questionKey),
    answer: t(item.answerKey)
  }))

  const filteredFaqs = faqCategory === 'all' 
    ? faqItems 
    : faqItems.filter(f => f.category === faqCategory)

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const getCategoryCount = (category: string) => {
    return tutorialData.filter(v => v.category === category).length
  }

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  // Helper untuk mendapatkan label kategori
  const getCategoryLabel = (key: string) => {
    const config = categoryConfig[key as keyof typeof categoryConfig]
    return config ? t(config.labelKey) : key
  }

  const getFaqCategoryLabel = (key: string) => {
    const config = faqCategoryConfig[key as keyof typeof faqCategoryConfig]
    return config ? t(config.labelKey) : key
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary/1">
        <div className="mx-auto max-w-6xl md:p-0 p-4">
          {/* Header */}
          <div className="flex md:min-h-[30vh] min-h-[15vh] items-center bg-[url(/illustrations/help-center-banner.png)] bg-cover bg-center bg-no-repeat">
            <div className="mx-auto w-full max-w-6xl px-4 ">
              {/* Header */}
              <h1 className="md:text-4xl text-2xl font-bold text-foreground mb-2"><span>{t('title1')}</span> <span className="text-primary">{t('title2')}</span></h1>
              <p className="md:text-xl text-sm md:text-muted-foreground md:backdrop-blur-none backdrop-blur-md max-w-2xl">
                {t('description')}
              </p>
            </div>
          </div>

          {/* ===== SECTION 1: VIDEO TUTORIAL ===== */}
          <div className="mb-10 md:pb-10 pb-4">
            <div className="mb-4 flex items-center gap-2 border-b border-primary/10 pb-2">
              <PlayCircle className="text-primary" size={24} />
              <h2 className="md:text-xl text-lg font-semibold text-foreground">
                {t('videoTutorials')}
              </h2>
              <div className="h-0.5 w-12 rounded-full bg-linear-to-r from-primary to-secondary" />
            </div>

            <div className="flex flex-col gap-6 lg:flex-row py-2">
              {/* Sidebar - Mobile Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-white p-3 text-sm font-medium text-foreground"
                >
                  <span>{getCategoryLabel(selectedCategory)}</span>
                  {isSidebarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Sidebar */}
              <div className={`lg:w-56 shrink-0 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="sticky top-20 space-y-1 rounded-lg border border-border bg-white p-2 shadow-sm">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon
                    const isActive = selectedCategory === key
                    const count = getCategoryCount(key)
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key)
                          setIsSidebarOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-all duration-200 hover:cursor-pointer border-b border-primary/10 ${
                          isActive 
                            ? 'bg-primary/80 text-white shadow-sm' 
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'text-white' : 'text-muted-foreground'} />
                        <span className="flex-1 text-left font-medium">{t(config.labelKey)}</span>
                        <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}

                  {/* Help Section di Sidebar */}
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <div className="flex items-start gap-2">
                      <MessageCircle size={16} className="mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {t('stillNeedHelp')}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {t('helpDescription')}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-2 h-7 w-full gap-1.5 bg-primary/90 text-xs text-white hover:bg-primary/80"
                      asChild
                    >
                      <a href="mailto:support@mentarigroups.com">
                        <MessageCircle size={12} />
                        {t('contactUs')}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Video Player */}
                {selectedVideo && (
                  <div className="mb-6 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                    <div className="relative aspect-video bg-black">
                      {!isPlaying ? (
                        <>
                          <img
                            src={getYouTubeThumbnail(selectedVideo.videoId)}
                            alt={selectedVideo.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://img.youtube.com/vi/${selectedVideo.videoId}/hqdefault.jpg`
                            }}
                          />
                          
                          <div 
                            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-all duration-300 hover:bg-black/40"
                            onClick={handlePlay}
                          >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-all duration-300 hover:scale-110 sm:h-16 sm:w-16">
                              <Play size={24} className="ml-1 text-primary sm:size-7" />
                            </div>
                          </div>

                          <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
                            <Clock size={11} className="mr-1 inline" />
                            {selectedVideo.duration}
                          </div>

                          <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
                            <Sparkles size={11} className="mr-1 inline" />
                            {getCategoryLabel(selectedVideo.category)}
                          </div>
                        </>
                      ) : (
                        <>
                          <iframe
                            src={`${selectedVideo.videoUrl}?autoplay=1&rel=0`}
                            title={selectedVideo.title}
                            className="h-full w-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                          <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 sm:p-5">
                      <h2 className="text-base font-semibold text-foreground sm:text-lg">
                        {selectedVideo.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedVideo.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge className={`bg-primary/10 text-primary border-0 text-[10px]`}>
                          {getCategoryLabel(selectedVideo.category)}
                        </Badge>
                        <Badge className="bg-muted text-muted-foreground text-[10px] border-0">
                          <Clock size={10} className="mr-1" /> {selectedVideo.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      {t('allTutorials')} ({filteredVideos.length})
                    </h3>
                  </div>

                  {filteredVideos.length > 0 ? (
                    <div className="space-y-2">
                      {filteredVideos.map((video) => {
                        const config = categoryConfig[video.category as keyof typeof categoryConfig]
                        const isActive = selectedVideo?.id === video.id
                        return (
                          <button
                            key={video.id}
                            onClick={() => {
                              setSelectedVideo(video)
                              setIsPlaying(false)
                            }}
                            className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200 sm:gap-4 ${
                              isActive 
                                ? 'border-primary/20 bg-primary/5' 
                                : 'border-border hover:bg-muted/50'
                            }`}
                          >
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-14 sm:w-20">
                              <img
                                src={getYouTubeThumbnail(video.videoId)}
                                alt={video.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/images/video-placeholder.png'
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle size={16} className="text-white drop-shadow-lg sm:size-5" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-medium truncate sm:text-sm ${
                                isActive ? 'text-primary' : 'text-foreground'
                              }`}>
                                {video.title}
                              </p>
                              <p className="hidden truncate text-[10px] text-muted-foreground sm:block sm:text-xs">
                                {video.description}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                                <Badge className={`bg-secondary/10 text-secondary border-0 text-[9px] px-1.5 py-0`}>
                                  {t(config.labelKey)}
                                </Badge>
                                <span className="text-[9px] text-muted-foreground sm:text-[10px]">
                                  <Clock size={9} className="mr-0.5 inline" />
                                  {video.duration}
                                </span>
                              </div>
                            </div>

                            {isActive && (
                              <ChevronRight size={16} className="shrink-0 text-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Video size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground">{t('noVideos')}</p>
                    </div>
                  )}
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {/* ===== SECTION 2: FAQ ===== */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <CircleHelp className="text-primary" size={24} />
            <h2 className="md:text-xl text-lg font-semibold text-foreground">
              {t('frequentlyAskedQuestions')}
            </h2>
            <div className="h-0.5 w-12 rounded-full bg-linear-to-r from-primary to-secondary" />
          </div>

          {/* FAQ Category Filter - Horizontal Scroll */}
          <div className="mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max gap-2 py-2">
              <button
                onClick={() => setFaqCategory('all')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  faqCategory === 'all'
                    ? 'bg-primary/80 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t('all')}
              </button>
              {Object.entries(faqCategoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFaqCategory(key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    faqCategory === key
                      ? 'bg-primary/80 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {t(config.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List - Grid dengan Search */}
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
            <p className="text-xs text-muted-foreground">
              {t('showingFaqs', { count: filteredFaqs.length, total: faqData.length })}
            </p>
          </div>

          {/* FAQ List - Accordion dengan max height + scroll */}
          <div 
            className={`overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 transition-all duration-300 ${
              showAllFaq ? 'max-h-full' : 'max-h-96'
            }`}
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id
                const config = faqCategoryConfig[faq.category as keyof typeof faqCategoryConfig]
                
                return (
                  <div
                    key={faq.id}
                    className={`overflow-hidden rounded-lg border transition-all duration-200 ${
                      isExpanded 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'border-border bg-white hover:border-primary/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-muted/20"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="shrink-0 rounded-full bg-primary/10 p-1.5">
                          {config?.icon ? <config.icon size={14} className="text-primary" /> : <HelpCircle size={14} className="text-primary" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                          {faq.question}
                        </span>
                      </div>
                      <div className="shrink-0 ml-2 rounded-full bg-muted p-1 transition-colors hover:bg-muted/80">
                        {isExpanded ? <Minus size={14} className="sm:size-4" /> : <Plus size={14} className="sm:size-4" />}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-border/50 px-3 py-3 sm:px-4 sm:py-3 bg-white/50">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className={`${t(config.labelKey) === 'Umum' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'} border-0 text-[8px] px-1.5 py-0`}>
                            {t(config.labelKey)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <HelpCircle size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm">{t('noFaqFound')}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{t('tryDifferentCategory')}</p>
              </div>
            )}
          </div>

          {/* Show More / Less */}
          {filteredFaqs.length > 5 && (
            <div className="mt-3 text-center">
              <button 
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                onClick={() => setShowAllFaq(!showAllFaq)}
              >
                {showAllFaq ? (
                  <>
                    {t('showLess')}
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    {t('showMore')}
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="relative md:mt-6 mt-2 overflow-hidden rounded-2xl bg-linear-to-r from-primary/5 via-primary/10 to-secondary/5 border border-border p-4 sm:p-6">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-4">
              <Headset size={32} className="text-primary" />
              <div className="">
                <p className="text-sm font-semibold text-foreground">
                  {t('stillNeedHelpTitle')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('stillNeedHelpDesc')}
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto flex items-center justify-center">
              <Button 
                className="gap-2 bg-primary text-white hover:bg-primary/80 shrink-0 w-full"
                asChild
              >
              <a href="mailto:support@mentarigroups.com">
                <MessageCircle size={16} />
                {t('contactUs')}
              </a>
            </Button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}