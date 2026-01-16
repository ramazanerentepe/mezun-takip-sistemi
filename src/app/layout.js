import './globals.css'
import { Inter } from 'next/font/google'

// Font ayarı (Next.js varsayılan fontu)
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  // Varsayılan başlık ve Şablon (Örn: Giriş Yap | Mezun Takip Sistemi)
  title: {
    default: 'Mezun Takip Sistemi',
    template: '%s | Mezun Takip Sistemi',
  },
  description: 'Mezun ve Akademisyen Takip Portalı',
  // Tarayıcı sekmesindeki ikon (Favicon)
  icons: {
    icon: '/logo.png', // Public klasörüne bu isimde bir resim koymalısın
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    // 1. HTML dilini Türkçe yapıyoruz (Türkçe karakter sorunlarını ve çeviri uyarısını çözer)
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}