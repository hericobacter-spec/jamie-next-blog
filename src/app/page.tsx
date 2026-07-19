import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import type { Metadata } from 'next'
import PostCard from '@/components/PostCard'
import { getPostImage, getPublicPosts } from '@/lib/posts'

const Shell = styled.div`
  width: min(100% - 40px, 1280px);
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1280px);
  }
`

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.55fr);
  gap: 72px;
  align-items: end;
  padding: clamp(76px, 10vw, 148px) 0 68px;
  border-bottom: 1px solid var(--border);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 70px 0 48px;
  }
`

const HeroTitle = styled.h1`
  max-width: 850px;
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-serif), serif;
  font-size: clamp(3rem, 7.2vw, 6.8rem);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: -0.07em;
  text-wrap: balance;
`

const HeroNote = styled.div`
  padding-bottom: 10px;
`

const Eyebrow = styled.p`
  margin: 0 0 12px;
  color: var(--forest);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const Intro = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: clamp(1rem, 1.7vw, 1.18rem);
  line-height: 1.8;
`

const AuthorLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 28px;
  padding: 22px 0;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-size: 14px;

  strong {
    color: var(--color-ink);
  }

  a {
    font-weight: 700;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`

const Categories = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 34px 0;
`

const Category = styled(Link)`
  padding: 9px 17px;
  color: var(--color-ink);
  background: color-mix(in srgb, var(--card-bg) 70%, transparent);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;

  &:first-child,
  &:hover {
    color: var(--primary-foreground);
    background: var(--forest);
    border-color: var(--forest);
  }
`

const SectionHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  margin: 34px 0 24px;

  h2 {
    margin: 0;
    font-family: var(--font-serif), serif;
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    font-weight: 600;
    letter-spacing: -0.055em;
  }

  span {
    color: var(--muted);
    font-size: 13px;
  }
`

const Featured = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  min-height: 560px;
  overflow: hidden;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    min-height: 0;
  }
`

const FeaturedVisual = styled(Link)`
  position: relative;
  min-height: 520px;
  overflow: hidden;
  background: linear-gradient(140deg, var(--sand), var(--sage));

  img {
    object-fit: cover;
    transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.025);
  }

  @media (max-width: 860px) {
    min-height: auto;
    aspect-ratio: 4 / 3;
  }
`

const FeaturedBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 5vw, 72px);
`

const FeatureMeta = styled.p`
  margin: 0 0 18px;
  color: var(--forest);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const FeatureTitle = styled(Link)`
  color: var(--color-ink);
  font-family: var(--font-serif), serif;
  font-size: clamp(2rem, 4.6vw, 3.65rem);
  font-weight: 600;
  line-height: 1.22;
  letter-spacing: -0.06em;

  &:hover {
    color: var(--forest);
  }
`

const FeatureDescription = styled.p`
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
`

const FeatureRead = styled(Link)`
  align-self: flex-start;
  margin-top: 42px;
  padding-bottom: 4px;
  color: var(--forest);
  border-bottom: 1px solid currentColor;
  font-weight: 700;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Latest = styled.section`
  padding: 86px 0 24px;
`

const AllPosts = styled(Link)`
  display: inline-flex;
  margin-top: 34px;
  padding: 12px 20px;
  color: var(--primary-foreground);
  background: var(--forest);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;

  &:hover {
    color: var(--primary-foreground);
    background: var(--forest-bright);
  }
`

export const metadata: Metadata = {
  title: 'Jamie Next — 직접 경험한 AI, 여행, 맛의 기록',
  description: 'AI를 직접 써보고, 가족과 여행하고, 동네의 맛을 기록하는 Jamie의 개인 저널입니다.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const posts = getPublicPosts()
  const featured = posts.find((post) => getPostImage(post)) ?? posts[0]
  const latest = posts.filter((post) => post.slug !== featured?.slug).slice(0, 6)
  const featuredImage = featured ? getPostImage(featured) : null

  return (
    <Shell>
      <Hero>
        <HeroTitle>일상을 직접 지나며 다음의 감각을 기록합니다.</HeroTitle>
        <HeroNote>
          <Eyebrow>Jamie&apos;s field journal</Eyebrow>
          <Intro>AI를 직접 써보고, 가족과 여행하고, 동네의 맛을 기록합니다. 검색을 위한 요약보다 경험에서 나온 구체적인 이야기를 남깁니다.</Intro>
        </HeroNote>
      </Hero>

      <AuthorLine>
        <span><strong>Jamie</strong> · 직접 경험하고 확인한 기록</span>
        <Link href="/about">이 블로그의 작성 원칙 보기 ↗</Link>
      </AuthorLine>

      <Categories aria-label="글 카테고리">
        <Category href="/posts">전체</Category>
        <Category href="/posts?category=A.I">AI &amp; Tech</Category>
        <Category href="/posts?category=Life">일상 &amp; 여행</Category>
        <Category href="/posts?category=Foodie">맛집</Category>
        <Category href="/posts?category=Blog">블로그 제작</Category>
      </Categories>

      {featured ? (
        <section>
          <SectionHeading>
            <h2>이번 주의 기록</h2>
            <span>Featured story</span>
          </SectionHeading>
          <Featured>
            <FeaturedVisual href={`/posts/${featured.slug}`}>
              {featuredImage ? <Image src={featuredImage} alt="" fill priority sizes="(max-width: 860px) 100vw, 55vw" /> : null}
            </FeaturedVisual>
            <FeaturedBody>
              <FeatureMeta>{featured.category} · {featured.date}</FeatureMeta>
              <FeatureTitle href={`/posts/${featured.slug}`}>{featured.title}</FeatureTitle>
              {featured.description ? <FeatureDescription>{featured.description}</FeatureDescription> : null}
              <FeatureRead href={`/posts/${featured.slug}`}>이야기 읽기 ↗</FeatureRead>
            </FeaturedBody>
          </Featured>
        </section>
      ) : null}

      <Latest>
        <SectionHeading>
          <h2>최근 기록</h2>
          <span>{posts.length}개의 공개 글</span>
        </SectionHeading>
        <Grid>
          {latest.map((post, index) => <PostCard key={post.slug} post={post} priority={index < 2} />)}
        </Grid>
        <AllPosts href="/posts">모든 기록 보기 ↗</AllPosts>
      </Latest>
    </Shell>
  )
}
