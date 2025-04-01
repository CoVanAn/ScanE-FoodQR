import { toast } from "sonner"
import { EntityError } from '@/lib/http'
import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import { TokenPayload } from "@/types/jwt.types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast("Event has been created",{
      description: error?.payload?.message ?? 'Lỗi không xác định',
      action: {
        label: 'Đóng',
        onClick: () => console.log("Undo"),
      }
    })
  }
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => 
   isBrowser ?  localStorage.getItem('accessToken') : null

export const getRefreshTokenFromLocalStorage = () => 
   isBrowser ? localStorage.getItem('refreshToken') : null

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}