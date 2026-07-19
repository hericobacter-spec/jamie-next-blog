import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { getPostImage } from '@/lib/posts'

const Card = styled.article`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-card);
  }
`

const VisualLink = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(255,255,255,0.45), transparent 48%),
    linear-gradient(135deg, var(--sand), var(--sage));

  img {
    object-fit: cover;
    transition: transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  ${Card}:hover & img {
    transform: scale(1.025);
  }
`

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(29, 41, 34, 0.72);
  font-family: var(--font-serif), serif;
  font-size: clamp(1.5rem, 4vw, 2.6rem);
  letter-spacing: -0.04em;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 1px solid rgba(29, 41, 34, 0.28);
    border-radius: 50%;
  }

  &::before {
    width: 46%;
    aspect-ratio: 1;
  }

  &::after {
    width: 68%;
    aspect-ratio: 1;
  }
`

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 24px 26px;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`

const Category = styled.span`
  color: var(--forest);
`

const TitleLink = styled(Link)`
  color: var(--color-ink);
  font-family: var(--font-serif), serif;
  font-size: clamp(1.35rem, 2.4vw, 1.72rem);
  font-weight: 600;
  line-height: 1.34;
  letter-spacing: -0.045em;

  &:hover {
    color: var(--forest);
  }
`

const Description = styled.p`
  display: -webkit-box;
  margin: 14px 0 0;
  overflow: hidden;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`

const Read = styled(Link)`
  align-self: flex-start;
  margin-top: auto;
  padding-top: 22px;
  color: var(--forest);
  font-size: 14px;
  font-weight: 700;
`

export default function PostCard({ post, priority = false }: { post: any; priority?: boolean }) {
  const category = post.category || post.meta?.category || '기록'
  const image = getPostImage(post)

  return (
    <Card>
      <VisualLink href={`/posts/${post.slug}`} aria-label={`${post.title} 읽기`}>
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" priority={priority} />
        ) : (
          <Placeholder aria-hidden="true">Jamie</Placeholder>
        )}
      </VisualLink>
      <Body>
        <Meta>
          <Category>{category}</Category>
          <span>·</span>
          <time dateTime={post.date}>{post.date}</time>
        </Meta>
        <TitleLink href={`/posts/${post.slug}`}>{post.title}</TitleLink>
        {post.description ? <Description>{post.description}</Description> : null}
        <Read href={`/posts/${post.slug}`}>기록 읽기 ↗</Read>
      </Body>
    </Card>
  )
}
