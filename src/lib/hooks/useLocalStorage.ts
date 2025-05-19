'use client'
import { useState } from 'react'

// Custom hook để lưu trữ dữ liệu giỏ hàng trong localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State để lưu trữ giá trị
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Lấy từ localStorage theo key
      const item = window.localStorage.getItem(key);
      // Parse lại JSON đã lưu hoặc giữ giá trị ban đầu
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Hàm cập nhật cả state và localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Kiểm tra nếu value là callback function
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Lưu state
      setStoredValue(valueToStore)
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
