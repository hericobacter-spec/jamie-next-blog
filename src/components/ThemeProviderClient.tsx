"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import light from '@/styles/theme'

const dark = {
  ...light,
  colors: {
    ...light.colors,
    bg: '#0b1220',
    surface: '#071024',
    primary: '#e6eef8',
    muted: '#9ca3af'
  }
}

export default function ThemeProviderClient({ children }:{children:React.ReactNode}){
  const [mode,setMode] = useState<'light'|'dark'>('light')
  useEffect(()=>{
    const saved = (typeof window !== 'undefined') && localStorage.getItem('theme')
    if(saved === 'dark') setMode('dark')
  },[])
  useEffect(()=>{
    if(typeof window !== 'undefined') localStorage.setItem('theme', mode)
  },[mode])
  return (
    <ThemeProvider theme={mode==='light'? light : dark}>
      <div data-theme={mode}>{children}</div>
    </ThemeProvider>
  )
}
