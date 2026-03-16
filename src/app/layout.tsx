import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GlobalStyle from '@/styles/global'
import React from 'react'
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300','400','600','700'] })
const merri = Merriweather({ subsets: ['latin'], variable: '--font-merri', weight: ['400','700'] })

export const metadata = {
  title: 'Jamie Next Blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en" className={`${inter.variable} ${merri.variable}`}>
      <body>
        <Providers>
          <GlobalStyle />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
