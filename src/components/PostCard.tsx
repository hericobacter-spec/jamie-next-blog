import Link from 'next/link'
import styled from 'styled-components'

const Card = styled.article`
  background: var(--card-bg);
  border-radius: var(--radius-card, 28px);
  padding: 28px;
  transition: opacity 0.15s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: none;

  &:hover {
    opacity: 0.85;
  }
`

const TitleLink = styled(Link)`
  font-size: 24px;
  font-weight: 600;
  color: var(--color-ink, #1d1d1f);
  line-height: 1.29;
  letter-spacing: -0.015em;
  margin: 0;
  flex: 1;

  &:hover {
    color: var(--color-ink, #1d1d1f);
    opacity: 0.7;
  }
`

const Meta = styled.div`
  color: var(--muted, #707070);
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`

const Tag = styled.span`
  background: var(--card-muted, #f5f5f7);
  color: var(--color-ink, #1d1d1f);
  padding: 4px 10px;
  border-radius: var(--radius-button, 999px);
  font-size: 12px;
  font-weight: 400;
`

const CategoryBadge = styled.span<{ $color?: string }>`
  padding: 4px 10px;
  border-radius: var(--radius-button, 999px);
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  background: ${(p) => p.$color || 'var(--color-azure, #0071e3)'};
`

const Description = styled.p`
  color: var(--muted, #707070);
  margin-top: 10px;
  flex: 1;
  line-height: 1.47;
  font-size: 17px;
  letter-spacing: -0.006em;
`

const Footer = styled.div`
  margin-top: 16px;
`

const ReadLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: var(--color-cobalt-link, #0066cc);

  &:hover {
    color: var(--color-azure, #0071e3);
  }
`

export default function PostCard({ post }: { post: any }) {
  const category = post.meta?.category || post.category
  const reading = post.readingTime || post.meta?.readingTime

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <TitleLink href={`/posts/${post.slug}`}>{post.title}</TitleLink>
        {category ? (
          <CategoryBadge
            $color={
              category === 'Foodie'
                ? '#34c759'
                : category === 'A.I'
                  ? '#5856d6'
                  : category === 'Life'
                    ? '#ff9500'
                    : category === 'News'
                      ? '#0071e3'
                      : 'var(--color-azure, #0071e3)'
            }
          >
            {category}
          </CategoryBadge>
        ) : null}
      </div>
      <Meta>
        <span>{post.date}</span>
        {reading ? <span>· {reading}</span> : null}
        {post.meta?.tags?.map((t: string) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Meta>
      <Description>{post.description}</Description>
      <Footer>
        <ReadLink href={`/posts/${post.slug}`}>Learn more ›</ReadLink>
      </Footer>
    </Card>
  )
}
