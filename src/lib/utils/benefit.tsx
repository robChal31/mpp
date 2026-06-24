
import { BookOpen, Mic, Briefcase, Globe, Users, TrendingUp, Trophy, Star, Gift, Ticket, Ruler } from 'lucide-react'
import { JSX } from 'react'

export const getBenefitIcon = (type: string, size: number = 20) => {
  const icons: Record<string, JSX.Element> = {
    'Curriculum & Training': <BookOpen size={size} />,
    'Guest English Teacher': <Mic size={size} />,
    'Pengembangan Pimpinan': <Ticket size={size} />,
    'Training Kolektif Online': <Ticket size={size} />,
    'Training Kolektif Offline': <Ticket size={size} />,
    'Masterclass Digital': <Ticket size={size} />,
    'Pelajar Berkreasi': <Trophy size={size} />,
    'Jambore': <Star size={size} />,
    'Assessment': <Ruler size={size} />,
  }
  return icons[type] || <Gift size={size} />
}

export const getDetailColor = (type: string) => {
  const colors: Record<string, string> = {
    'Curriculum & Training': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
    'Guest English Teacher': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
    'Pengembangan Pimpinan': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800',
    'Training Kolektif Online': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800',
    'Training Kolektif Offline': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    'Masterclass Digital': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    'Pelajar Berkreasi': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800',
    'Jambore': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
    'Assessment': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800'
  }
  return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
}