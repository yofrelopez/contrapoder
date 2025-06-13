// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Merriweather } from 'next/font/google'


const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
})


export const metadata: Metadata = {
  title: 'Contra Poder',
  description: 'Blog de noticias regionales y de interés público',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <html lang="es" className={merriweather.className}>
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Contra Poder logo"
                width={200}
                height={40}
                className="w-40 h-10 object-contain"
                priority
              />
             {/*  <span className="text-xl font-bold tracking-tight hidden sm:inline">Contra Poder</span> */}
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-4">{children}</main>

        <footer className="text-sm text-gray-500 text-center py-4 border-t border-gray-200 dark:border-gray-800">
          © {new Date().getFullYear()} Contra Poder
        </footer>
      </body>
      </html>
    </html>
  )
}
