'use client'

import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { OrderStatus } from '@/constants/type'
// import socket from '@/lib/socket'
import { formatCurrency, getVietnameseOrderStatus, handleErrorApi } from '@/lib/utils'
// import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import {
  PayGuestOrdersResType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import Image from 'next/image'
import {useEffect, useMemo } from 'react'
import { useAppContext } from '@/components/app-provider'
import { useCreatePaymentMutation } from '@/queries/useVnpay'
import { Button } from '@/components/ui/button'

export default function OrdersCart() {    
  const {socket} = useAppContext()
  const { data, refetch } = useGuestGetOrderListQuery()
  const { mutateAsync: createPaymentMutate, isPending: isPaymentLoading } = useCreatePaymentMutation()
  // console.log('data', data?.payload.data)
  const orders = useMemo(() => data?.payload.data ?? [], [data])
  console.log('orders', orders)
  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity
            }
          }
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity
            }
          }
        }
        return result
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0
        },
        paid: {
          price: 0,
          quantity: 0
        }
      }
    )
  }, [orders])

  useEffect(() => {

    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const {
        dishSnapshot: { name },
        quantity
      } = data
      toast('',{
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          data.status
        )}"`
      })
      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast('',{
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`
      })
      refetch()
    }

    socket?.on('update-order', onUpdateOrder)
    socket?.on('payment', onPayment)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onUpdateOrder)
      socket?.off('payment', onPayment)
    }
  }, [refetch, socket])

  // Hàm xử lý thanh toán VNPay
  const handleVNPayPayment = async () => {
    try {
      if (waitingForPaying.quantity === 0) {
        toast("Không có đơn hàng nào cần thanh toán");
        return;
      }

      // Lấy danh sách orderIds cần thanh toán
      const orderIds = orders
        .filter(order => 
          order.status === OrderStatus.Delivered || 
          order.status === OrderStatus.Processing || 
          order.status === OrderStatus.Pending
        )
        .map(order => order.id);

      // Gọi API tạo URL thanh toán
      const response = await createPaymentMutate({
        amount: waitingForPaying.price,
        orderInfo: "Thanh toán đơn hàng FoodScan",
        orderIds: orderIds
      });

      // Nếu tạo URL thành công, chuyển hướng đến trang thanh toán
      if (response.payload.data?.paymentUrl) {
        window.location.href = response.payload.data.paymentUrl;
      } else {
        toast("Có lỗi khi tạo liên kết thanh toán");
      }
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className='container py-4 space-y-4 px-6 sm:px-0'>
      {orders.map((order, index) => (
        <div key={order.id} className='flex gap-4'>
          {/* <div className='text-sm font-semibold'>{index + 1}</div> */}
          <div className='flex-shrink-0 relative'>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <div className='text-xs font-semibold'>
              {formatCurrency(order.dishSnapshot.price)} x{' '}
              <Badge className='px-1'>{order.quantity}</Badge>
            </div>
          </div>
          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant={'outline'}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0 && (
        <div className='sticky bottom-0 '>
          <div className='w-full flex space-x-4 text-xl font-semibold'>
            <span>Đơn đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
      <div className='sticky bottom-0 '>
        <div className='w-full flex space-x-4 font-semibold'>
          <span>Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </div>
      </div>
      <div className='space-y-4'>
        <Button
          onClick={handleVNPayPayment}
          disabled={waitingForPaying.quantity === 0}
          className="w-full flex justify-between items-center bg-blue-500 hover:bg-blue-600"
        >
          <div className="flex items-center">
            <div className="bg-white text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">VN</div>
            <span>Thanh toán VNPay</span>
          </div>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </Button>
      </div>
    </div>
  )
}
