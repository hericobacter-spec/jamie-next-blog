# Jamie Next Blog

A minimal, MDX-driven blog starter tailored for Jamie.

## Project overview

This project is a small blog built with Next.js (App Router), MDX files for content, and styled-components for styling. It includes:

- MDX filesystem posts (posts/*.mdx)
- Prism-based code highlighting with copy button
- Category filtering (query param) with 4 fixed categories: Blog, Foodie, A.I, Life
- Tag pages (/tags/[tag]) and tag badges
- Reading time, simple TOC on post pages
- Dark mode via styled-components ThemeProvider
- SEO metadata per page and generated sitemap.xml and rss.xml (in public/)

## Tech stack

- Next.js (App Router)
- React
- styled-components
- prism-react-renderer
- next-mdx-remote
- gray-matter for frontmatter
- reading-time

## Local development

1. Install dependencies:

   pnpm install

2. Run dev server:

   pnpm dev

3. Build for production (this runs sitemap/rss generation before build):

   pnpm build

4. Start production server:

   pnpm start

## Writing posts

- Add MDX files to the `posts/` directory.
- Frontmatter supported fields (example):

```
---
title: "My Post Title"
date: "2026-03-17"
description: "Short description for SEO"
tags: ["Next.js","Blog"]
thumbnail: "/images/avatar.png"
category: "Blog"
---
```

- Categories must be one of: `Blog`, `Foodie`, `A.I`, `Life`. If `category` is omitted, the post appears in `All` but not in category-specific filters.
- Tags are free-form strings; tag pages are generated at `/tags/{tag}`.

## Categories and filtering

- Category filter is implemented as query param: `/posts?category=Foodie`.
- The UI shows pills for All / Blog / Foodie / A.I / Life.

## Sitemap & RSS

- Sitemap: `public/sitemap.xml` (generated from posts and tags).
- RSS: `public/rss.xml` (RSS 2.0 feed generated from posts).
- Generation script: `app-sitemap-rss/generate.js`.
- By default `pnpm build` runs the script (via `prebuild`) so public files are regenerated during build.

## Deployment

- Recommended: Vercel. The project is configured for the App Router and static generation.
- siteUrl is set to `https://jamie-next-blog.vercel.app` for metadata and sitemap generation. Update it if you deploy to a different domain.

## Excluded / TODO

- Search functionality
- Comments and analytics integrations
- Advanced dark-mode theming polish
- Tag pagination
- Full RSS item content (currently description + link + pubDate)

## Maintenance notes

- If you add/remove posts, re-run `pnpm run generate:seo` (or `pnpm build`) to update sitemap/rss.
- Keep `public/images/` updated for thumbnails referenced in frontmatter.

---

If you want, I can open a PR with these changes or push the branch upstream.