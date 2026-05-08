// components/navbar/local-switcher.tsx
'use client'

import { useState } from 'react'
import { Locale, useLocale } from 'next-intl'
import { ChevronDown, Check } from 'lucide-react'
import CountryFlag from 'react-country-flag'

type LocalSwitcherProps = {
    changeLocalAction: (locale: Locale) => Promise<void>
}

const languages = [
    { code: 'id', name: 'Indonesia', countryCode: 'id', label: 'ID' },
    { code: 'en', name: 'English', countryCode: 'gb', label: 'EN' },
]

export default function LocalSwitcher({ changeLocalAction }: LocalSwitcherProps) {
    const currentLocale = useLocale()
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const handleChange = async (locale: Locale) => {
        if (locale === currentLocale) {
            setIsOpen(false)
            return
        }
        
        setIsPending(true)
        try {
            await changeLocalAction(locale)
        } finally {
            setIsPending(false)
            setIsOpen(false)
        }
    }

    const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-all duration-200 text-sm font-medium"
            >
                <CountryFlag countryCode={currentLang.countryCode} svg style={{ width: '1.2em', height: '1.2em' }} />
                <span className="hidden sm:inline">{currentLang.label}</span>
                <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-36 rounded-lg border border-border bg-background shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleChange(lang.code as Locale)}
                                    disabled={isPending}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                                        currentLocale === lang.code
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'hover:bg-muted/50 text-foreground'
                                    }`}
                                >
                                    <CountryFlag countryCode={lang.countryCode} svg style={{ width: '1.2em', height: '1.2em' }} />
                                    <span className="flex-1 text-left">{lang.name}</span>
                                    {currentLocale === lang.code && <Check size={14} className="text-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}