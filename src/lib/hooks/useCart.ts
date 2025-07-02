'use client'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useLocalStorage } from './useLocalStorage'

// Custom hook để quản lý giỏ hàng
export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<GuestCreateOrdersBodyType>('cart-items', [])

  // Thêm món ăn vào giỏ hàng
  const addToCart = (orders: { dishId: number; quantity: number }[]) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems]
      
      // Xử lý tất cả các món một lần
      orders.forEach(order => {
        const { dishId, quantity } = order
        const existingItemIndex = newItems.findIndex(item => item.dishId === dishId)

        if (existingItemIndex >= 0) {
          // Cập nhật số lượng nếu món ăn đã có trong giỏ
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity
          }
        } else {
          // Thêm món ăn mới vào giỏ
          newItems.push({ dishId, quantity })
        }
      })

      return newItems
    })
  }

  // Cập nhật số lượng món ăn
  const updateQuantity = (dishId: number, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.dishId !== dishId)
      }

      const index = prevItems.findIndex((item) => item.dishId === dishId)
      if (index === -1) {
        return [...prevItems, { dishId, quantity }]
      }

      const newItems = [...prevItems]
      newItems[index] = { ...newItems[index], quantity }
      return newItems
    })
  }

  // Xóa món khỏi giỏ hàng
  const removeFromCart = (dishId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.dishId !== dishId))
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([])
  }

  // Tính tổng số lượng món trong giỏ
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return {
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount
  }
}
