import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const siteUrl = 'https://jamie-next-blog.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts()

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/posts`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ]

    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${siteUrl}/posts/${post.slug}`,
        lastModified: post?.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    return [...staticRoutes, ...postRoutes]
}