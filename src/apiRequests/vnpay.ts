import http from '@/lib/http'
import {
    CreatePaymentBody,
    CreatePaymentBodyType,
} from '@/schemaValidations/vnpay.schema'

const vnpayApiRequest = {
    createPayment: (body: CreatePaymentBodyType) =>
        http.post<string>('vnpay/create-payment', body),
    getPaymentStatus: () =>
        http.get<string>(`vnpay/check-payment`),
}

export default vnpayApiRequest