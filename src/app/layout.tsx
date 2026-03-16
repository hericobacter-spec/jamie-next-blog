import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GlobalStyle from '@/styles/global'
import React from 'react'

export const metadata = {
  title: 'Jamie Next Blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
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
