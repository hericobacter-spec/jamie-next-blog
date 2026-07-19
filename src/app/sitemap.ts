import type { MetadataRoute } from 'next'
import { getPublicPosts } from '@/lib/posts'

const siteUrl = 'https://jamie-next-blog.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getPublicPosts()

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
        {
            url: `${siteUrl}/about`,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/contact`,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/privacy-policy`,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]

    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${siteUrl}/posts/${post.slug}`,
        lastModified: post?.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [...staticRoutes, ...postRoutes]
}
