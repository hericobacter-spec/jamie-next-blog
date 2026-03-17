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
    }catch(e){/* ignore */}
  }
  return (
    <button id="theme-toggle" aria-label="Toggle theme" onClick={toggle} style={{marginLeft:12, padding:"6px 8px", borderRadius:6, border:"1px solid #e6edf3", background:"transparent", cursor:"pointer"}}>🌓</button>
  )
}
