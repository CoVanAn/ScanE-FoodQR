'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import Image from 'next/image'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useDishListQuery } from '@/queries/useDish'
import { useEffect, useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Quantity from '@/app/guest/menu/quantity'
import { useCart } from '@/lib/hooks/useCart'
import { DishStatus } from '@/constants/type'

export default function CartPage() {
  const router = useRouter()
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data ?? [], [data])
  const { cartItems, setCartItems, updateQuantity } = useCart()
  const { mutateAsync } = useGuestOrderMutation()

  // Tính tổng giá trị đơn hàng
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const item = cartItems.find((item) => item.dishId === dish.id)
      if (!item) return result
      return result + item.quantity * dish.price
    }, 0)
  }, [dishes, cartItems])
  // Xử lý thay đổi số lượng món ăn
  const handleQuantityChange = (dishId: number, quantity: number) => {
    updateQuantity(dishId, quantity)
  }

  // Xử lý đặt hàng
  const handleOrder = async () => {
    try {
      await mutateAsync(cartItems)
      // Xóa giỏ hàng sau khi đặt hàng thành công
      setCartItems([])
      router.push(`/guest/orders`)
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  // Kiểm tra nếu giỏ hàng trống thì chuyển về trang menu
  useEffect(() => {
    if (cartItems.length === 0) {
      // Có thể bỏ dòng này nếu muốn hiển thị thông báo giỏ hàng trống
      // router.push('/guest/menu')
    }
  }, [cartItems, router])

  return (
    <div className="container py-4 space-y-4 px-6 sm:px-0">
      <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4">Giỏ hàng của bạn đang trống</p>
          <Button
            className="bg:#214227 dark:bg-[#33762F] text-white"
          onClick={() => router.push('/guest/menu')}>Quay lại menu</Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => {
              const dish = dishes.find((d) => d.id === item.dishId)
              if (!dish) return null

              return (
                <div key={dish.id} className="flex gap-4 border-b pb-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      height={100}
                      width={100}
                      quality={100}
                      className="object-cover w-[80px] h-[80px] rounded-md"
                    />
                  </div>

                  <div className="space-y-1 flex-grow">
                    <h3 className="text-sm font-medium">{dish.name}</h3>
                    <p className="text-xs">{dish.description}</p>
                    <p className="text-sm font-semibold">{formatCurrency(dish.price)}</p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end justify-between">
                    <Quantity
                      onChange={(value) => handleQuantityChange(item.dishId, value)}
                      value={item.quantity}
                    />
                    <p className="text-sm font-medium">
                      {formatCurrency(dish.price * item.quantity)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Tổng tiền</span>
              <span className="font-semibold">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="sticky bottom-0 pt-4">
            <Button
              className="w-full justify-between bg-[#214227] dark:bg-[#33762F] text-white"
              onClick={handleOrder}
              disabled={cartItems.length === 0}
            >
              <span>Đặt hàng · {cartItems.length} món</span>
              <span>{formatCurrency(totalPrice)}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
