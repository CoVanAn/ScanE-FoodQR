import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Trang không tồn tại - 404 | Phở An Cồ',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng quay lại trang chủ.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LocaleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center mi
    n-h-[60vh] px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        {/* 404 Graphic */}
        <div className="text-6xl font-bold text-primary/20 mb-4">
          404
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Không tìm thấy trang
          </h1>
          <p className="text-muted-foreground">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/dishes"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Xem menu
          </Link>
        </div>

        {/* Additional Navigation */}
        <div className="pt-4 text-sm text-muted-foreground">
          <Link href="/tables" className="hover:text-primary transition-colors">
            Xem danh sách bàn
          </Link>
        </div>
      </div>
    </div>
  )
}
