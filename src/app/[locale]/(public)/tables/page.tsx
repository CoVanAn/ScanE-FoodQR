import { Metadata } from 'next'
import tableApiRequest from '@/apiRequests/table'
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
    title: 'Danh Sách Bàn - Phở An Cồ',
    description: 'Xem danh sách các bàn tại nhà hàng Phở An Cồ. Quét mã QR để đặt món trực tiếp tại bàn hoặc chọn bàn phù hợp cho nhóm của bạn.',
    keywords: ['bàn ăn', 'đặt bàn', 'qr code', 'nhà hàng', 'phở an cồ', 'table booking'],
    alternates: {
      canonical: `/${locale}/tables`,
      languages: {
        'vi': '/vi/tables',
        'en': '/en/tables',
      },
    },
    openGraph: {
      title: 'Danh Sách Bàn - Phở An Cồ',
      description: 'Xem danh sách các bàn tại nhà hàng Phở An Cồ. Quét mã QR để đặt món trực tiếp.',
      images: [
        {
          url: '/banner.jpg',
          width: 1200,
          height: 630,
          alt: 'Danh sách bàn Phở An Cồ',
        },
      ],
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Danh Sách Bàn - Phở An Cồ',
      description: 'Xem danh sách các bàn tại nhà hàng Phở An Cồ.',
      images: ['/banner.jpg'],
    },
  }
}

export default async function TablesPage() {
  const t = await getTranslations('TablesPage')

  let tableList = []
  try {
    const result = await tableApiRequest.list()
    tableList = result.payload.data
  } catch (error) {
    return <div>Có lỗi xảy ra khi tải danh sách bàn</div>
  }

  const breadcrumbData = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Danh sách bàn', url: '/tables' }
  ]

  return (
    <>
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Danh Sách Bàn
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quét mã QR tại bàn để đặt món trực tiếp hoặc chọn bàn phù hợp cho nhóm của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tableList.map((table: any) => (
            <Link
              key={table.number}
              href={`/tables/${table.number}`}
              className="group bg-card hover:bg-card/80 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 border"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                {table.number}
              </div>
              <div className="text-sm text-muted-foreground">
                Bàn số {table.number}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {table.capacity ? `${table.capacity} người` : 'Quét QR để đặt món'}
              </div>
            </Link>
          ))}
        </div>

        {tableList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Hiện tại chưa có bàn nào được thiết lập
            </p>
          </div>
        )}
      </div>
    </>
  )
}
