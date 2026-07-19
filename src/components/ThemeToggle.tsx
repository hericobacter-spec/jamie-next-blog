"use client"
import React, { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved === 'dark' ? 'dark' : 'light'
    setMode(initial)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { mode: next } }))
  }

  return (
    <button
      id="theme-toggle"
      aria-label={mode === 'dark' ? '밝은 화면으로 전환' : '어두운 화면으로 전환'}
      onClick={toggle}
      style={{
        marginLeft: 4,
        padding: "6px 10px",
        borderRadius: "var(--radius-button, 999px)",
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1,
        opacity: 0.7,
        color: "var(--color-ink)",
        transition: "opacity 0.15s ease",
      }}
    >
      {mounted ? (mode === 'dark' ? '☀' : '☾') : '◑'}
    </button>
  )
}
