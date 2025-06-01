'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function PaymentCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'processing'>('processing')
  
  // Lấy các tham số từ URL
  const status = searchParams.get('status')
  
  // Kiểm tra kết quả thanh toán từ tham số URL
  useEffect(() => {
    // Nếu có status từ URL, sử dụng nó
    if (status === 'success') {
      setPaymentStatus('success')
    } else if (status === 'failed') {
      setPaymentStatus('failed')
    } else {
      // Nếu không có status, giả định là đang xử lý
      // Trong thực tế, sau 3 giây sẽ chuyển sang thất bại
      const timeout = setTimeout(() => {
        setPaymentStatus('failed')
      }, 3000)
      
      return () => clearTimeout(timeout)
    }
  }, [status])

  return (
    <div className="container flex flex-col items-center justify-center py-12">
      {paymentStatus === 'processing' && (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
          <h1 className="text-2xl font-bold mb-4">Đang kiểm tra thanh toán...</h1>
          <p>Vui lòng đợi trong giây lát</p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 17L19 8" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Thanh toán thành công!</h1>
          <p className="mb-8">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
          <Button onClick={() => router.push('/guest/orders')}>Xem đơn hàng của bạn</Button>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Thanh toán thất bại</h1>
          <p className="mb-8">Đã có lỗi xảy ra trong quá trình thanh toán</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push('/guest/cart')}>
              Quay lại giỏ hàng
            </Button>
            <Button onClick={() => router.push('/guest/orders')}>
              Xem đơn hàng
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
