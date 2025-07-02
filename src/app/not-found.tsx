import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trang không tồn tại - 404 | Phở An Cồ',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng quay lại trang chủ hoặc xem menu của chúng tôi.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootNotFound() {
  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
          <div className="max-w-md w-full space-y-6">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-primary mb-2">
                Phở An Cồ
              </h1>
              <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
            </div>
            
            {/* 404 Content */}
            <div className="space-y-4">
              <h2 className="text-6xl font-bold text-primary/20">
                404
              </h2>
              <h3 className="text-2xl font-bold text-foreground">
                Không tìm thấy trang
              </h3>
              <p className="text-muted-foreground">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. 
                Có thể bạn đã nhập sai địa chỉ hoặc trang đã được di chuyển.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="/vi"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                🏠 Về trang chủ
              </Link>
              <Link
                href="/vi/dishes"
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
              >
                🍜 Xem menu
              </Link>
            </div>

            {/* Additional Help */}
            {/* <div className="pt-8 text-sm text-muted-foreground">
              <p>Hoặc bạn có thể:</p>
              <div className="flex justify-center space-x-4 mt-2">
                <Link href="/vi/tables" className="hover:text-primary transition-colors">
                  Xem danh sách bàn
                </Link>
                <span>•</span>
                <Link href="/vi" className="hover:text-primary transition-colors">
                  Quay lại trang chủ
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </body>
    </html>
  )
}
