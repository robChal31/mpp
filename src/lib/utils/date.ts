export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export const formatEventDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// lib/utils/date.ts

/**
 * Format date range dengan handling beda bulan dan tahun
 * Contoh:
 * - 22 - 24 Juli 2026
 * - 30 Juni - 7 Juli 2026
 * - 28 Des 2026 - 3 Jan 2027
 */
export function formatDateRange(startDate: string, endDate: string, locale: string = 'id') {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const startDay = start.getDate()
    const endDay = end.getDate()
    const startMonth = start.getMonth()
    const endMonth = end.getMonth()
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()
    
    const monthNames = {
        id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
    
    const months = monthNames[locale as keyof typeof monthNames] || monthNames.id
    
    // Jika sama tahun dan sama bulan
    if (startYear === endYear && startMonth === endMonth) {
        return `${startDay} - ${endDay} ${months[startMonth]} ${startYear}`
    }
    
    // Jika sama tahun tapi beda bulan
    if (startYear === endYear) {
        return `${startDay} ${months[startMonth]} - ${endDay} ${months[endMonth]} ${startYear}`
    }
    
    // Jika beda tahun
    return `${startDay} ${months[startMonth]} ${startYear} - ${endDay} ${months[endMonth]} ${endYear}`
}

/**
 * Format untuk tampilan yang lebih pendek (untuk card)
 * Contoh: 22 - 24 Jul 2026
 */
export function formatDateRangeShort(startDate: string, endDate: string, locale: string = 'id') {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const startDay = start.getDate()
    const endDay = end.getDate()
    const startMonth = start.getMonth()
    const endMonth = end.getMonth()
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()
    
    const monthNames = {
        id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
    
    const months = monthNames[locale as keyof typeof monthNames] || monthNames.id
    
    if (startYear === endYear && startMonth === endMonth) {
        return `${startDay} - ${endDay} ${months[startMonth]} ${startYear}`
    }
    
    if (startYear === endYear) {
        return `${startDay} ${months[startMonth]} - ${endDay} ${months[endMonth]} ${startYear}`
    }
    
    return `${startDay} ${months[startMonth]} ${startYear} - ${endDay} ${months[endMonth]} ${endYear}`
}