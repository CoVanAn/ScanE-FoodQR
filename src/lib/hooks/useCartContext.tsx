'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'

interface CartContextType {
  cartItems: GuestCreateOrdersBodyType
  cartCount: number
  addToCart: (orders: { dishId: number; quantity: number }[]) => void
  updateQuantity: (dishId: number, quantity: number) => void
  removeFromCart: (dishId: number) => void
  clearCart: () => void
  setCartItems: (items: GuestCreateOrdersBodyType) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<GuestCreateOrdersBodyType>([])
  const [isClient, setIsClient] = useState(false)

  // Đảm bảo chỉ chạy trên client
  useEffect(() => {
    setIsClient(true)
    // Load cart từ localStorage khi component mount
    try {
      const stored = localStorage.getItem('cart-items')
      if (stored) {
        const parsedItems = JSON.parse(stored)
        setCartItems(parsedItems)
        console.log('📦 Cart loaded from localStorage:', parsedItems)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Sync với localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('cart-items', JSON.stringify(cartItems))
        console.log('💾 Cart saved to localStorage:', cartItems)
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isClient])

  // Thêm món ăn vào giỏ hàng
  const addToCart = (orders: { dishId: number; quantity: number }[]) => {
    setCartItems((prevItems) => {
      let newItems = [...prevItems]
      
      orders.forEach(order => {
        const { dishId, quantity } = order
        const existingItemIndex = newItems.findIndex(item => item.dishId === dishId)

        if (existingItemIndex >= 0) {
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity
          }
        } else {
          newItems.push({ dishId, quantity })
        }
      })

      console.log('➕ Added to cart:', orders, 'New cart:', newItems)
      return newItems
    })
  }

  // Cập nhật số lượng món ăn
  const updateQuantity = (dishId: number, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        const filtered = prevItems.filter((item) => item.dishId !== dishId)
        console.log('🗑️ Removed from cart:', dishId, 'New cart:', filtered)
        return filtered
      }

      const index = prevItems.findIndex((item) => item.dishId === dishId)
      if (index === -1) {
        const newItems = [...prevItems, { dishId, quantity }]
        console.log('➕ Added new item to cart:', { dishId, quantity }, 'New cart:', newItems)
        return newItems
      }

      const newItems = [...prevItems]
      newItems[index] = { ...newItems[index], quantity }
      console.log('📝 Updated cart quantity:', { dishId, quantity }, 'New cart:', newItems)
      return newItems
    })
  }

  // Xóa món khỏi giỏ hàng
  const removeFromCart = (dishId: number) => {
    setCartItems((prevItems) => {
      const filtered = prevItems.filter((item) => item.dishId !== dishId)
      console.log('🗑️ Removed from cart:', dishId, 'New cart:', filtered)
      return filtered
    })
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([])
    console.log('🧹 Cart cleared')
  }

  // Tính tổng số lượng món trong giỏ
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const value: CartContextType = {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setCartItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
