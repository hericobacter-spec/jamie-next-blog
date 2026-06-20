"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import light from '@/styles/theme'

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved === 'dark' ? 'dark' : 'light'
    setMode(initial)
    setMounted(true)
    document.documentElement.setAttribute('data-theme', initial)

    const handler = (e: any) => {
      const m = e?.detail?.mode || (localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
      setMode(m)
      document.documentElement.setAttribute('data-theme', m)
    }
    window.addEventListener('theme-change', handler as EventListener)
    return () => window.removeEventListener('theme-change', handler as EventListener)
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('theme', mode)
  }, [mode, mounted])

  return (
    <ThemeProvider theme={light}>
      {children}
    </ThemeProvider>
  )
}
