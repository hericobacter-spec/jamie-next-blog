# jamie-next-blog

A minimal Next.js blog scaffold using MDX and styled-components.

## Run locally

1. Install dependencies

   pnpm install

2. Start dev server

   pnpm dev

3. Build for production

   pnpm build

## Posts

Write posts in the `posts/` folder as MDX files. Frontmatter supported:

- title
- date (YYYY-MM-DD)
- description
- tags (optional list)

Example: `posts/first-post.mdx`.

## Deployment

Deploy to Vercel by connecting this GitHub repository to Vercel and deploying the `main` branch. Vercel supports the Next.js App Router out of the box.

## Currently excluded / TODO

- Search (Algolia)
- Analytics
- Comments
- contentlayer (disabled for now; posts are loaded via filesystem + gray-matter)

