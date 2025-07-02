'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Oops! Có lỗi xảy ra
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau hoặc liên hệ với chúng tôi.
          </p>
          <div className="space-x-4">
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 p-4 bg-gray-100 rounded max-w-2xl">
              <summary className="cursor-pointer font-semibold">Chi tiết lỗi (Dev mode)</summary>
              <pre className="mt-2 text-sm text-left overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  )
}
