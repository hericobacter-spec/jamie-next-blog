"use client"
import React from "react"

export default function ThemeToggle(){
  const toggle = ()=>{
    try{
      const cur = localStorage.getItem("theme") === "dark" ? "dark" : "light"
      const next = cur === "dark" ? "light" : "dark"
      localStorage.setItem("theme", next)
      // notify ThemeProviderClient
      window.dispatchEvent(new CustomEvent("theme-change", { detail: { mode: next }}))
      document.documentElement.setAttribute("data-theme", next)
      // directly set CSS vars to ensure immediate visual update
      if(typeof document !== 'undefined'){
        if(next === 'dark'){
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
      }
    }catch(e){/* ignore */}
  }
  return (
    <button id="theme-toggle" aria-label="Toggle theme" onClick={toggle} style={{marginLeft:12, padding:"6px 8px", borderRadius:6, border:"1px solid #e6edf3", background:"transparent", cursor:"pointer"}}>🌓</button>
  )
}
