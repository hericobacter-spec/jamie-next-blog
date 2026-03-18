import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

const Hero = styled.section`
  background:linear-gradient(180deg,#ffffff, #f8fafc);padding:80px 0 40px;border-bottom:1px solid #eef2f7;
`
const HeroInner = styled.div`
  max-width:960px;margin:0 auto;padding:0 24px;display:flex;gap:24px;align-items:center;justify-content:space-between;
`
const CTAs = styled.div`
  display:flex;gap:12px;margin-top:12px;
`
const CTAButtonLink = styled(Link)`
  padding:10px 14px;border-radius:8px;background:#111827;color:#fff;text-decoration:none;font-weight:600;
`
const Section = styled.section`
  padding:36px 0;
`
export default function Home(){
  // Minimal render for binary-search diagnosis
  return <main>home debug</main>
}
