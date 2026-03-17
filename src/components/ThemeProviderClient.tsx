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
    const initial = saved === 'dark' ? 'dark' : 'light'
    setMode(initial)
    // apply CSS vars immediately on mount
    if(typeof document !== 'undefined'){
      const apply = (m:string)=>{
        if(m === 'dark'){
          document.documentElement.style.setProperty('--background','#0b1220')
          document.documentElement.style.setProperty('--foreground','#e6eef8')
          document.documentElement.style.setProperty('--card-bg','#071024')
          document.documentElement.style.setProperty('--muted','#9ca3af')
          document.documentElement.style.setProperty('--code-bg','#071024')
        } else {
          document.documentElement.style.setProperty('--background','#ffffff')
          document.documentElement.style.setProperty('--foreground','#171717')
          document.documentElement.style.setProperty('--card-bg','#ffffff')
          document.documentElement.style.setProperty('--muted','#6b7280')
          document.documentElement.style.setProperty('--code-bg','#f8fafc')
        }
        document.documentElement.setAttribute('data-theme', m)
      }
      apply(initial)
    }
    // listen for external toggles from Header button
    const handler = (e:any)=>{
      const m = e?.detail?.mode || (localStorage.getItem('theme')==='dark' ? 'dark' : 'light')
      setMode(m)
      if(typeof document !== 'undefined'){
        // mirror CSS vars
        if(m === 'dark'){
          document.documentElement.style.setProperty('--background','#0b1220')
          document.documentElement.style.setProperty('--foreground','#e6eef8')
          document.documentElement.style.setProperty('--card-bg','#071024')
          document.documentElement.style.setProperty('--muted','#9ca3af')
          document.documentElement.style.setProperty('--code-bg','#071024')
        } else {
          document.documentElement.style.setProperty('--background','#ffffff')
          document.documentElement.style.setProperty('--foreground','#171717')
          document.documentElement.style.setProperty('--card-bg','#ffffff')
          document.documentElement.style.setProperty('--muted','#6b7280')
          document.documentElement.style.setProperty('--code-bg','#f8fafc')
        }
        document.documentElement.setAttribute('data-theme', m)
      }
    }
    window.addEventListener('theme-change', handler as EventListener)
    return ()=> window.removeEventListener('theme-change', handler as EventListener)
  },[])
  useEffect(()=>{
    if(typeof window !== 'undefined') localStorage.setItem('theme', mode)
  },[mode])
  useEffect(()=>{
    // keep data-theme attr in sync immediately
    if(typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', mode)
  },[mode])
  return (
    <ThemeProvider theme={mode==='light'? light : dark}>
      <div data-theme={mode}>{children}</div>
    </ThemeProvider>
  )
}
