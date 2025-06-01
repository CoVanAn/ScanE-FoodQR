import { z } from 'zod';

// Schema cơ bản cho request tạo URL thanh toán
export const CreatePaymentBody = z.object({
  amount: z.number().positive(),
  orderInfo: z.string().optional(),
  orderIds: z.array(z.number()).optional(), // Thêm trường orderIds để lưu danh sách ID của các đơn hàng
});

export type CreatePaymentBodyType = z.infer<typeof CreatePaymentBody>;

// Schema cho response từ API tạo URL thanh toán
export const PaymentResponse = z.object({
  message: z.string(),
  data: z.object({
    paymentUrl: z.string(),
    transactionId: z.string()
  })
});

export type PaymentResponseType = z.infer<typeof PaymentResponse>;

// Schema cho thông tin trạng thái thanh toán
export const PaymentStatus = z.enum(['success', 'failed', 'pending']);
export type PaymentStatusType = z.infer<typeof PaymentStatus>;