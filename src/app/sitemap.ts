import { MetadataRoute } from 'next'
import dishApiRequest from '@/apiRequests/dish'
import { generateSlugUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com' // Thay bằng domain thật
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/vi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vi/dishes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/dishes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vi/tables`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/tables`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic dish pages
  let dishPages: MetadataRoute.Sitemap = []
  try {
    const result = await dishApiRequest.list()
    const dishes = result.payload.data
    
    dishPages = dishes.flatMap((dish) => [
      {
        url: `${baseUrl}/vi/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`,
        lastModified: new Date(dish.updatedAt || dish.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/en/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`,
        lastModified: new Date(dish.updatedAt || dish.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
    ])
  } catch (error) {
    console.error('Error generating sitemap for dishes:', error)
  }

  return [...staticPages, ...dishPages]
}
