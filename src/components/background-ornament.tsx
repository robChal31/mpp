const BackgroundOrnament = () => {
  return (
    <>
        {/* Blur circles background */}
        <div className="absolute -top-40 -right-20 w-150 h-150 rounded-full blur-3xl bg-linear-to-br from-[#3279FF]/15 via-[#3279FF]/5 to-transparent" />
        <div className="absolute -bottom-40 -left-20 w-125 h-125 rounded-full blur-3xl bg-linear-to-tr from-[#FFB347]/10 via-[#FFB347]/4 to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full blur-3xl bg-[#3279FF]/5" />
        
        {/* ============ BARIS 1 - ATAS ============ */}
        
        {/* Bunga Besar - Pink/Magenta (Top Left) */}
        <div className="absolute top-[3%] left-[5%] opacity-70">
            <svg width="90" height="90" viewBox="0 0 90 90">
            {[...Array(12)].map((_, i) => (
                <ellipse
                key={i}
                cx="45"
                cy="45"
                rx="12"
                ry="28"
                fill="#ec4899"
                opacity="0.4"
                transform={`rotate(${i * 30}, 45, 45)`}
                />
            ))}
            <circle cx="45" cy="45" r="14" fill="#3279FF" opacity="0.7" />
            <circle cx="45" cy="45" r="7" fill="#FFB347" opacity="0.9" />
            </svg>
        </div>
        
        {/* Bunga Sedang - Biru Tua (Top Center-Left) */}
        <div className="absolute top-[8%] left-[22%] opacity-60">
            <svg width="55" height="55" viewBox="0 0 55 55">
            {[...Array(8)].map((_, i) => (
                <ellipse
                key={i}
                cx="27.5"
                cy="27.5"
                rx="8"
                ry="18"
                fill="#1e40af"
                opacity="0.45"
                transform={`rotate(${i * 45}, 27.5, 27.5)`}
                />
            ))}
            <circle cx="27.5" cy="27.5" r="9" fill="#ec4899" opacity="0.6" />
            <circle cx="27.5" cy="27.5" r="4" fill="#FFB347" opacity="0.8" />
            </svg>
        </div>
        
        {/* Bunga Kecil - Orange (Top Center) */}
        <div className="absolute top-[5%] left-[45%] opacity-65">
            <svg width="40" height="40" viewBox="0 0 40 40">
            {[...Array(6)].map((_, i) => (
                <ellipse
                key={i}
                cx="20"
                cy="20"
                rx="6"
                ry="14"
                fill="#f97316"
                opacity="0.5"
                transform={`rotate(${i * 60}, 20, 20)`}
                />
            ))}
            <circle cx="20" cy="20" r="7" fill="#3279FF" opacity="0.7" />
            <circle cx="20" cy="20" r="3" fill="#fff" opacity="0.9" />
            </svg>
        </div>
        
        {/* Bunga Besar - Ungu (Top Right) */}
        <div className="absolute top-[2%] right-[8%] opacity-55">
            <svg width="85" height="85" viewBox="0 0 85 85">
            {[...Array(10)].map((_, i) => (
                <ellipse
                key={i}
                cx="42.5"
                cy="42.5"
                rx="11"
                ry="25"
                fill="#8b5cf6"
                opacity="0.4"
                transform={`rotate(${i * 36}, 42.5, 42.5)`}
                />
            ))}
            <circle cx="42.5" cy="42.5" r="13" fill="#FFB347" opacity="0.7" />
            <circle cx="42.5" cy="42.5" r="6" fill="#fff" opacity="0.8" />
            </svg>
        </div>
        
        {/* Bunga Kecil - Merah Muda (Top Right) */}
        <div className="absolute top-[15%] right-[20%] opacity-50">
            <svg width="30" height="30" viewBox="0 0 30 30">
            {[...Array(5)].map((_, i) => (
                <ellipse
                key={i}
                cx="15"
                cy="15"
                rx="5"
                ry="11"
                fill="#fb7185"
                opacity="0.5"
                transform={`rotate(${i * 72}, 15, 15)`}
                />
            ))}
            <circle cx="15" cy="15" r="5" fill="#3279FF" opacity="0.6" />
            </svg>
        </div>
        
        {/* ============ BARIS 2 - TENGAH ============ */}
        
        {/* Bunga Sedang - Hijau Mint (Left Middle) */}
        <div className="absolute top-[30%] left-[3%] opacity-55">
            <svg width="60" height="60" viewBox="0 0 60 60">
            {[...Array(8)].map((_, i) => (
                <ellipse
                key={i}
                cx="30"
                cy="30"
                rx="7"
                ry="17"
                fill="#14b8a6"
                opacity="0.4"
                transform={`rotate(${i * 45}, 30, 30)`}
                />
            ))}
            <circle cx="30" cy="30" r="10" fill="#f97316" opacity="0.65" />
            <circle cx="30" cy="30" r="4" fill="#fff" opacity="0.8" />
            </svg>
        </div>
        
        {/* Bunga Besar - Kuning (Center) */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 opacity-45">
            <svg width="75" height="75" viewBox="0 0 75 75">
            {[...Array(14)].map((_, i) => (
                <ellipse
                key={i}
                cx="37.5"
                cy="37.5"
                rx="9"
                ry="22"
                fill="#fbbf24"
                opacity="0.35"
                transform={`rotate(${i * 25.7}, 37.5, 37.5)`}
                />
            ))}
            <circle cx="37.5" cy="37.5" r="11" fill="#ec4899" opacity="0.6" />
            <circle cx="37.5" cy="37.5" r="5" fill="#3279FF" opacity="0.8" />
            </svg>
        </div>
        
        {/* Bunga Kecil - Teal (Right Middle) */}
        <div className="absolute top-[35%] right-[5%] opacity-60">
            <svg width="35" height="35" viewBox="0 0 35 35">
            {[...Array(6)].map((_, i) => (
                <ellipse
                key={i}
                cx="17.5"
                cy="17.5"
                rx="5"
                ry="12"
                fill="#0d9488"
                opacity="0.45"
                transform={`rotate(${i * 60}, 17.5, 17.5)`}
                />
            ))}
            <circle cx="17.5" cy="17.5" r="6" fill="#fbbf24" opacity="0.7" />
            <circle cx="17.5" cy="17.5" r="2.5" fill="#fff" opacity="0.9" />
            </svg>
        </div>
        
        {/* Bunga Sedang - Salmon (Left Middle 2) */}
        <div className="absolute top-[55%] left-[8%] opacity-50">
            <svg width="50" height="50" viewBox="0 0 50 50">
            {[...Array(7)].map((_, i) => (
                <ellipse
                key={i}
                cx="25"
                cy="25"
                rx="7"
                ry="16"
                fill="#f43f5e"
                opacity="0.4"
                transform={`rotate(${i * 51.4}, 25, 25)`}
                />
            ))}
            <circle cx="25" cy="25" r="8" fill="#14b8a6" opacity="0.65" />
            <circle cx="25" cy="25" r="3.5" fill="#fff" opacity="0.8" />
            </svg>
        </div>
        
        {/* ============ BARIS 3 - BAWAH ============ */}
        
        {/* Bunga Besar - Navy (Bottom Left) */}
        <div className="absolute bottom-[15%] left-[12%] opacity-55">
            <svg width="80" height="80" viewBox="0 0 80 80">
            {[...Array(10)].map((_, i) => (
                <ellipse
                key={i}
                cx="40"
                cy="40"
                rx="10"
                ry="23"
                fill="#1e3a8a"
                opacity="0.4"
                transform={`rotate(${i * 36}, 40, 40)`}
                />
            ))}
            <circle cx="40" cy="40" r="12" fill="#f43f5e" opacity="0.7" />
            <circle cx="40" cy="40" r="5" fill="#fbbf24" opacity="0.9" />
            </svg>
        </div>
        
        {/* Bunga Sedang - Amber (Bottom Center) */}
        <div className="absolute bottom-[8%] left-[45%] opacity-60">
            <svg width="55" height="55" viewBox="0 0 55 55">
            {[...Array(8)].map((_, i) => (
                <ellipse
                key={i}
                cx="27.5"
                cy="27.5"
                rx="8"
                ry="17"
                fill="#d97706"
                opacity="0.45"
                transform={`rotate(${i * 45}, 27.5, 27.5)`}
                />
            ))}
            <circle cx="27.5" cy="27.5" r="9" fill="#8b5cf6" opacity="0.65" />
            <circle cx="27.5" cy="27.5" r="4" fill="#fff" opacity="0.8" />
            </svg>
        </div>
        
        {/* Bunga Kecil - Cyan (Bottom Right) */}
        <div className="absolute bottom-[12%] right-[10%] opacity-55">
            <svg width="32" height="32" viewBox="0 0 32 32">
            {[...Array(5)].map((_, i) => (
                <ellipse
                key={i}
                cx="16"
                cy="16"
                rx="5"
                ry="11"
                fill="#06b6d4"
                opacity="0.5"
                transform={`rotate(${i * 72}, 16, 16)`}
                />
            ))}
            <circle cx="16" cy="16" r="5.5" fill="#f97316" opacity="0.7" />
            <circle cx="16" cy="16" r="2.5" fill="#fff" opacity="0.9" />
            </svg>
        </div>
        
        {/* Bunga Sedang - Rose (Bottom Right 2) */}
        <div className="absolute bottom-[25%] right-[18%] opacity-45">
            <svg width="45" height="45" viewBox="0 0 45 45">
            {[...Array(6)].map((_, i) => (
                <ellipse
                key={i}
                cx="22.5"
                cy="22.5"
                rx="6"
                ry="14"
                fill="#be185d"
                opacity="0.4"
                transform={`rotate(${i * 60}, 22.5, 22.5)`}
                />
            ))}
            <circle cx="22.5" cy="22.5" r="7" fill="#06b6d4" opacity="0.6" />
            <circle cx="22.5" cy="22.5" r="3" fill="#fbbf24" opacity="0.8" />
            </svg>
        </div>
        
        {/* Bunga Super Kecil - Random Tambahan */}
        <div className="absolute top-[20%] right-[35%] opacity-40">
            <svg width="18" height="18" viewBox="0 0 18 18">
            {[...Array(4)].map((_, i) => (
                <ellipse
                key={i}
                cx="9"
                cy="9"
                rx="2.5"
                ry="6"
                fill="#f59e0b"
                opacity="0.5"
                transform={`rotate(${i * 90}, 9, 9)`}
                />
            ))}
            <circle cx="9" cy="9" r="3" fill="#ec4899" opacity="0.6" />
            </svg>
        </div>
        
        <div className="absolute bottom-[35%] right-[30%] opacity-35">
            <svg width="15" height="15" viewBox="0 0 15 15">
            {[...Array(4)].map((_, i) => (
                <ellipse
                key={i}
                cx="7.5"
                cy="7.5"
                rx="2"
                ry="5"
                fill="#8b5cf6"
                opacity="0.45"
                transform={`rotate(${i * 90}, 7.5, 7.5)`}
                />
            ))}
            <circle cx="7.5" cy="7.5" r="2.5" fill="#fbbf24" opacity="0.5" />
            </svg>
        </div>
        
        {/* ============ DAUN-DAUN ============ */}
        
        {/* Daun Hijau 1 - Kiri Atas */}
        <div className="absolute left-[15%] top-[12%] opacity-40 rotate-12">
            <svg width="40" height="55" viewBox="0 0 40 55">
            <path d="M20 5 C10 18, 5 32, 10 45 C15 52, 25 50, 28 42 C31 34, 28 20, 20 5Z" fill="#10b981" opacity="0.35" />
            <path d="M20 5 L20 45" stroke="#10b981" strokeWidth="1.2" opacity="0.5" />
            </svg>
        </div>
        
        {/* Daun Orange 1 - Kanan Atas */}
        <div className="absolute right-[18%] top-[25%] opacity-35 -rotate-15">
            <svg width="35" height="50" viewBox="0 0 35 50">
            <path d="M17 8 C25 20, 30 35, 25 45 C20 52, 10 48, 8 38 C6 28, 10 16, 17 8Z" fill="#ea580c" opacity="0.3" />
            <path d="M17 8 L17 45" stroke="#ea580c" strokeWidth="1" opacity="0.45" />
            </svg>
        </div>
        
        {/* Daun Biru 1 - Kiri Bawah */}
        <div className="absolute left-[8%] bottom-[30%] opacity-35 rotate-45">
            <svg width="38" height="52" viewBox="0 0 38 52">
            <path d="M19 6 C28 18, 33 35, 28 47 C23 55, 12 50, 10 40 C8 30, 12 16, 19 6Z" fill="#3b82f6" opacity="0.3" />
            <path d="M19 6 L19 47" stroke="#3b82f6" strokeWidth="1" opacity="0.45" />
            </svg>
        </div>
        
        {/* Daun Ungu 1 - Kanan Bawah */}
        <div className="absolute right-[12%] bottom-[40%] opacity-30 -rotate-30">
            <svg width="33" height="48" viewBox="0 0 33 48">
            <path d="M16 5 C24 16, 28 32, 23 43 C18 50, 8 46, 6 36 C4 26, 8 14, 16 5Z" fill="#8b5cf6" opacity="0.3" />
            <path d="M16 5 L16 43" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
            </svg>
        </div>
        
        {/* ============ GARIS LENGKUNG ORGANIK ============ */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-12">
            <path d="M-50 150 C150 50, 350 250, 550 150 T1050 200" stroke="#3279FF" strokeWidth="2" fill="none" strokeDasharray="8 8" />
            <path d="M-50 400 C200 500, 400 350, 600 450 T1050 400" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="6 10" />
            <path d="M-50 650 C250 550, 450 700, 700 600 T1050 650" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeDasharray="4 12" />
            
            {/* Ornamen titik di garis */}
            <circle cx="550" cy="150" r="3.5" fill="#3279FF" opacity="0.35" />
            <circle cx="600" cy="450" r="3.5" fill="#ec4899" opacity="0.35" />
            <circle cx="700" cy="600" r="3" fill="#fbbf24" opacity="0.3" />
        </svg>
        
        {/* Dot pattern halus */}
        <div className="absolute inset-0 opacity-12 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3279FF 0.6px, transparent 0.6px)', backgroundSize: '40px 40px' }} />
        
        {/* Gradient edges */}
        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-linear-to-b from-[#3279FF]/8 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-linear-to-t from-[#FFB347]/6 via-transparent to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute top-[18%] right-[28%] w-2 h-2 rounded-full bg-[#3279FF]/40 animate-pulse" />
        <div className="absolute top-[48%] left-[18%] w-1.5 h-1.5 rounded-full bg-[#FFB347]/40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[28%] right-[25%] w-2 h-2 rounded-full bg-[#ec4899]/35 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[72%] left-[28%] w-1.5 h-1.5 rounded-full bg-[#fbbf24]/35 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[55%] right-[12%] w-1 h-1 rounded-full bg-[#8b5cf6]/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[85%] right-[40%] w-1.5 h-1.5 rounded-full bg-[#10b981]/30 animate-pulse" style={{ animationDelay: '0.8s' }} />
    </>
  )
}

export default BackgroundOrnament
