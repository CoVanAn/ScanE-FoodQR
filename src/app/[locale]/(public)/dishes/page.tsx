import { Metadata } from 'next'
import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import StructuredData from '@/components/structured-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: 'Menu Món Ăn - Phở An Cồ',
    description: 'Khám phá menu đa dạng của nhà hàng Phở An Cồ với các món phở truyền thống, món ăn Việt Nam đặc sản và nhiều lựa chọn hấp dẫn khác.',
    keywords: ['menu', 'món ăn', 'phở', 'nhà hàng', 'phở an cồ', 'vietnamese food', 'restaurant menu'],
    alternates: {
      canonical: `/${locale}/dishes`,
      languages: {
        'vi': '/vi/dishes',
        'en': '/en/dishes',
      },
    },
    openGraph: {
      title: 'Menu Món Ăn - Phở An Cồ',
      description: 'Khám phá menu đa dạng của nhà hàng Phở An Cồ với các món phở truyền thống và món ăn Việt Nam đặc sản.',
      images: [
        {
          url: '/banner.jpg',
          width: 1200,
          height: 630,
          alt: 'Menu Phở An Cồ',
        },
      ],
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Menu Món Ăn - Phở An Cồ',
      description: 'Khám phá menu đa dạng của nhà hàng Phở An Cồ với các món phở truyền thống.',
      images: ['/banner.jpg'],
    },
  }
}

export default async function DishesPage() {

  

  const t = await getTranslations('DishesPage')

  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.list()
    const {
      payload: { data }
    } = result
    dishList = data
  } catch (error) {
    return <div>Có lỗi xảy ra khi tải danh sách món ăn</div>
  }

  // Prepare breadcrumb data
  const breadcrumbData = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Menu món ăn', url: '/dishes' }
  ]


  return (
    <>
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Menu Món Ăn
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá menu đa dạng của chúng tôi với các món phở truyền thống và nhiều lựa chọn hấp dẫn khác
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishList.map((dish) => (
            <Link
              key={dish.id}
              href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`}
              className="group bg-card hover:bg-card/80 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={dish.image || '/muoi_tieu_goc.jpg'}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {dish.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {dish.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(dish.price)}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    #{dish.id}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {dishList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Hiện tại chưa có món ăn nào trong menu
            </p>
          </div>
        )}
      </div>
    </>
  )
}
