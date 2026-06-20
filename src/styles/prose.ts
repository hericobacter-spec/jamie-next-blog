import { css } from 'styled-components'

/**
 * Apple-tuned prose styles for MDX content.
 * Handles existing post formatting patterns: frequent hr, blank lines,
 * large headings, images, and blockquotes.
 */
const prose = css`
  .prose {
    color: var(--color-ink, #1d1d1f);
    font-size: 17px;
    line-height: 1.6;
    letter-spacing: -0.006em;
    word-break: break-word;
  }

  /* ── Headings ── */
  .prose h1 {
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.17;
    margin: 0 0 16px;
    color: var(--color-ink, #1d1d1f);
  }

  /* The first h1 in a post shouldn't have top margin — it's the title */
  .prose > h1:first-child {
    margin-top: 0;
  }

  .prose h2 {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin: 48px 0 16px;
    color: var(--color-ink, #1d1d1f);
  }

  .prose h3 {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.008em;
    line-height: 1.29;
    margin: 32px 0 12px;
    color: var(--color-ink, #1d1d1f);
  }

  .prose h4 {
    font-size: 20px;
    font-weight: 600;
    margin: 24px 0 8px;
    color: var(--color-ink, #1d1d1f);
  }

  /* ── Paragraphs — collapse excessive blank lines ── */
  .prose p {
    margin: 0 0 16px;
    color: var(--color-ink, #1d1d1f);
  }

  .prose p + p {
    margin-top: 0;
  }

  /* ── Lists ── */
  .prose ul,
  .prose ol {
    margin: 0 0 16px;
    padding-left: 24px;
    color: var(--color-ink, #1d1d1f);
  }

  .prose li {
    margin: 4px 0;
    line-height: 1.6;
  }

  .prose li > ul,
  .prose li > ol {
    margin: 4px 0;
  }

  /* ── Blockquote — Apple style ── */
  .prose blockquote {
    border-left: 3px solid var(--color-azure, #0071e3);
    padding: 8px 20px;
    margin: 16px 0;
    color: var(--color-graphite, #707070);
    font-style: italic;
    background: var(--card-muted, #f5f5f7);
    border-radius: 0 12px 12px 0;
  }

  .prose blockquote p {
    margin: 0;
  }

  /* ── Horizontal rules — tone down the excessive --- in posts ── */
  .prose hr {
    border: none;
    height: 1px;
    background: var(--border, #e8e8ed);
    margin: 40px 0;
  }

  /* ── Links ── */
  .prose a {
    color: var(--color-cobalt-link, #0066cc);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .prose a:hover {
    color: var(--color-azure, #0071e3);
    text-decoration: underline;
  }

  /* ── Strong / Em ── */
  .prose strong {
    font-weight: 600;
    color: var(--color-ink, #1d1d1f);
  }

  .prose em {
    font-style: italic;
  }

  /* ── Images — Apple rounded cards ── */
  .prose img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 24px auto;
    border-radius: var(--radius-card, 28px);
  }

  .prose figure {
    margin: 24px 0;
  }

  .prose figcaption {
    font-size: 12px;
    color: var(--muted, #707070);
    text-align: center;
    margin-top: 8px;
    line-height: 1.33;
  }

  /* ── Tables ── */
  .prose table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
    line-height: 1.43;
  }

  .prose th,
  .prose td {
    border-bottom: 1px solid var(--border, #e8e8ed);
    padding: 12px 16px;
    text-align: left;
  }

  .prose th {
    font-weight: 600;
    color: var(--color-ink, #1d1d1f);
  }

  .prose td {
    color: var(--color-slate, #474747);
  }

  /* ── Inline code ── */
  .prose code {
    background: var(--card-muted, #f5f5f7);
    color: var(--color-ink, #1d1d1f);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.88em;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }

  /* ── Block code ── */
  .prose pre {
    margin: 20px 0;
  }

  .prose pre code {
    background: transparent;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    color: inherit;
  }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .prose {
      font-size: 16px;
    }
    .prose h1 {
      font-size: 26px;
    }
    .prose h2 {
      font-size: 22px;
    }
    .prose h3 {
      font-size: 20px;
    }
    .prose img {
      border-radius: var(--radius-card-compact, 20px);
    }
    .prose table {
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
`

export default prose
