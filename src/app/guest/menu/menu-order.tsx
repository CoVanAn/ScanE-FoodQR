'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import Quantity from '@/app/guest/menu/quantity'
import { useEffect, useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useRouter } from 'next/navigation'
import { DishStatus } from '@/constants/type'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'

export default function MenuOrder() {
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data ?? [], [data])
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const router = useRouter()
  const { addToCart, cartItems, cartCount } = useCart()
    // React 19 hoặc Next.js 15 thì không cần dùng useMemo chỗ này
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id)
      if (!order) return result
      return result + order.quantity * dish.price
    }, 0)
  }, [dishes, orders])
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }
  const handleAddToCart = () => {
   
    addToCart(orders)
    // Hiển thị thông báo thành công
    toast.success(`Đã thêm ${orders.length} món vào giỏ hàng`)
    
    // Reset lại danh sách đã chọn
    setOrders([])
    
    // Điều hướng đến trang giỏ hàng
    router.push('/guest/cart')
  }
  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={
              cn('flex gap-3 px-6 sm:px-0', {
              'pointer-events-none': dish.status === DishStatus.Unavailable
            })}
            
          >
            <div className='flex-shrink-0 relative '>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 flex items-center justify-center text-sm'>
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>
                {formatCurrency(dish.price)}
              </p>
            </div>          
              <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={
                  orders.find((order) => order.dishId === dish.id)?.quantity ??
                  0
                }
              />
            </div>
          </div>
        ))}      <div className='sticky bottom-0 flex flex-col gap-2'>
        <Button
          className='w-full justify-between h-12'
          onClick={handleAddToCart}
          disabled={orders.length === 0}
        >
          <span>Thêm vào giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
        
        <Button
          className='w-full h-12'
          variant="outline"
          onClick={() => router.push('/guest/cart')}
        >
          Xem giỏ hàng {cartCount > 0 && `(${cartCount})`}
        </Button>
      </div>
    </>
  )
}
