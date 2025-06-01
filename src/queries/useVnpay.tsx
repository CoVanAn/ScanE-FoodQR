import { useMutation } from '@tanstack/react-query'
import vnpayApiRequest from '@/apiRequests/vnpay'
import { CreatePaymentBodyType } from '@/schemaValidations/vnpay.schema'

// Hook để tạo URL thanh toán VNPAY
export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentBodyType) => vnpayApiRequest.createPayment(data),
  })
}
