// src/app/(main)/tutorial/page.tsx
'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Video,
  Clock,
  LogIn,
  Gift,
  Calendar,
  FileText,
  User,
  PlayCircle
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface VideoTutorial {
  id: string
  title: string
  description: string
  category: 'access' | 'benefits' | 'events' | 'programs' | 'account'
  duration: string
  thumbnail: string
  videoUrl: string
}

const tutorialData: VideoTutorial[] = [
  // Access
  { id: '1', title: 'Cara Login ke Platform', description: 'Panduan login menggunakan email dan password yang sudah terdaftar.', category: 'access', duration: '2:30', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  { id: '2', title: 'Cara Reset Password (Belum Login)', description: 'Lupa password? Ikuti panduan reset password melalui halaman login.', category: 'access', duration: '3:00', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  { id: '3', title: 'Cara Ganti Password (Sudah Login)', description: 'Ganti password akun Anda melalui menu pengaturan setelah login.', category: 'access', duration: '2:15', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  { id: '4', title: 'Cara Logout dari Platform', description: 'Keluar dari akun dengan aman melalui menu profil.', category: 'access', duration: '1:30', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  // Benefits
  { id: '5', title: 'Cara Melihat Benefit Tersedia', description: 'Lihat daftar benefit yang tersedia untuk sekolah Anda.', category: 'benefits', duration: '2:15', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  { id: '6', title: 'Cara Mengklaim Benefit', description: 'Panduan lengkap mengklaim benefit dari program kemitraan.', category: 'benefits', duration: '4:20', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  // Events
  { id: '7', title: 'Cara Melihat Event yang Tersedia', description: 'Temukan event-event menarik untuk mitra Mentari.', category: 'events', duration: '2:45', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  { id: '8', title: 'Cara Mendaftar Event', description: 'Panduan mendaftar event dan mengisi data peserta.', category: 'events', duration: '5:00', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  // Programs
  { id: '9', title: 'Cara Melihat Program & Dokumen', description: 'Akses dan lihat dokumen program kemitraan Anda.', category: 'programs', duration: '2:30', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
  // Account
  { id: '10', title: 'Cara Mengelola Akun Sekolah', description: 'Kelola profil dan informasi akun sekolah Anda.', category: 'account', duration: '2:00', thumbnail: '', videoUrl: 'https://youtu.be/k4wRpxdgo6o' },
]

const categoryConfig = {
  'access': { 
    label: 'Akses Akun', 
    icon: LogIn, 
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30'
  },
  'benefits': { 
    label: 'Benefit', 
    icon: Gift, 
    color: 'text-[#3279FF]',
    bg: 'bg-[#3279FF]/10'
  },
  'events': { 
    label: 'Event', 
    icon: Calendar, 
    color: 'text-[#FFB347]',
    bg: 'bg-[#FFB347]/10'
  },
  'programs': { 
    label: 'Program', 
    icon: FileText, 
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30'
  },
  'account': { 
    label: 'Akun', 
    icon: User, 
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30'
  }
}

export default function TutorialPage() {
  const t = useTranslations('Tutorial')
  const [selectedCategory, setSelectedCategory] = useState<string>('access')
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(tutorialData[0])

  const filteredVideos = tutorialData.filter(v => v.category === selectedCategory)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 backdrop-blur-lg">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10">
          <Video className="text-[#3279FF]" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Split Layout: Sidebar + Content */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          <div className="sticky top-20 space-y-1 bg-white py-4 px-2 rounded-lg shadow-lg">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              const isActive = selectedCategory === key
              const count = tutorialData.filter(v => v.category === key).length
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`hover:cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border-b  ${
                    isActive 
                      ? 'bg-[#3279FF] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} className="text-primary" />
                  <span className="flex-1 text-left font-medium">{config.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
            {/* Video Player */}
            {selectedVideo && (
            <div className="mb-6 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {selectedVideo.videoUrl && selectedVideo.videoUrl.includes('youtube.com') ? (
                        <iframe
                            src={selectedVideo.videoUrl.replace('watch?v=', 'embed/')}
                            title={selectedVideo.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : selectedVideo.videoUrl && selectedVideo.videoUrl.includes('youtu.be') ? (
                        <iframe
                            src={selectedVideo.videoUrl.replace('youtu.be/', 'youtube.com/embed/')}
                            title={selectedVideo.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-full bg-[#3279FF]/10 flex items-center justify-center mb-3">
                                    <Play size={28} className="text-[#3279FF] ml-1" />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedVideo.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Video player not available</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedVideo.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedVideo.description}
                    </p>
                    <Badge className="mt-2 text-[10px]">
                        <Clock size={10} className="mr-1" /> {selectedVideo.duration}
                    </Badge>
                </div>
            </div>
            )}

          {/* Video List */}
          {filteredVideos.length > 0 ? (
            <div className="space-y-2">
              {filteredVideos.map((video) => {
                const config = categoryConfig[video.category as keyof typeof categoryConfig]
                const isActive = selectedVideo?.id === video.id
                return (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-[#3279FF]/5 border border-[#3279FF]/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${isActive ? 'bg-[#3279FF]/10' : 'bg-gray-100 dark:bg-gray-800'} flex items-center justify-center shrink-0`}>
                      <PlayCircle size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[#3279FF]' : 'text-gray-900 dark:text-white'}`}>
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {video.description}
                      </p>
                    </div>
                    <Badge className="text-[10px] shrink-0">
                      <Clock size={10} className="mr-1" /> {video.duration}
                    </Badge>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{t('noVideos')}</p>
            </div>
          )}
        </div>
        
      </div>
      
    </div>
  )
}