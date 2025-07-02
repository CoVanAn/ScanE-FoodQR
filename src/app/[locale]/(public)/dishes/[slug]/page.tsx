import dishApiRequest from '@/apiRequests/dish'
import React from 'react'
import { wrapServerApi } from '@/lib/utils'
import DishDetail from './dish-detail'
import { getIdFromSlugUrl } from '@/lib/utils'
import { Metadata } from 'next'
import StructuredData from '@/components/structured-data'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const id = getIdFromSlugUrl(slug)
  
  try {
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
    const dish = data?.payload?.data
    
    if (!dish) {
      return {
        title: 'Món ăn không tồn tại',
        description: 'Món ăn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        robots: { index: false, follow: false },
      }
    }

    const dishPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(dish.price)

    return {
      title: `${dish.name} - ${dishPrice}`,
      description: dish.description || `Thưởng thức ${dish.name} tại Phở An Cồ với giá ${dishPrice}. Đặt món online ngay hôm nay!`,
      keywords: [dish.name, "phở", "món việt", "đặt món online", "nhà hàng", "phở an cồ"],
      alternates: {
        canonical: `/${locale}/dishes/${slug}`,
        languages: {
          'vi': `/vi/dishes/${slug}`,
          'en': `/en/dishes/${slug}`,
        },
      },
      openGraph: {
        title: `${dish.name} - Phở An Cồ`,
        description: dish.description || `Thưởng thức ${dish.name} tại Phở An Cồ với giá ${dishPrice}.`,
        images: [
          {
            url: dish.image || "/banner.jpg",
            width: 1200,
            height: 630,
            alt: dish.name,
          },
        ],
        type: "article",
        locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      },
      twitter: {
        card: "summary_large_image",
        title: `${dish.name} - Phở An Cồ`,
        description: dish.description || `Thưởng thức ${dish.name} tại Phở An Cồ với giá ${dishPrice}.`,
        images: [dish.image || "/banner.jpg"],
      },
    }
  } catch (error) {
    return {
      title: 'Lỗi tải món ăn',
      description: 'Có lỗi xảy ra khi tải thông tin món ăn.',
      robots: { index: false, follow: false },
    }
  }
}

const page = async ({ params  }: {
  params: Promise<{
    slug: string
  }>
}) => {
  const { slug } = await params
  const id =  getIdFromSlugUrl(slug)
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
  const dish = data?.payload?.data
  if (!dish) {
    notFound() // ← Triggers not-found.tsx
  }

  const dishData = {
    name: dish.name,
    description: dish.description,
    image: dish.image,
    price: dish.price,
    slug: slug
  }
  

  return (
    <>
      <StructuredData type="dish" data={dishData} />
      <DishDetail dish={dish} />
    </>
  )
}

export default page
