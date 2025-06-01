import http from '@/lib/http'
import {
    CreatePaymentBodyType,
    PaymentResponseType,
} from '@/schemaValidations/vnpay.schema'

const vnpayApiRequest = {
    createPayment: (body: CreatePaymentBodyType) =>
        http.post<PaymentResponseType>('vnpay/create-payment', body),
}

export default vnpayApiRequest