'use client'

import { checkAndRefreshToken, getRoleFromClient } from '@/lib/utils'
import { on } from 'events'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppStore } from './app-provider'
import { set } from 'date-fns'

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const socket = useAppStore(state => state.socket)
  const setSocket = useAppStore(state => state.setSocket)
  const disconnectSocket = useAppStore(state => state.disconnectSocket)
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    let interval: any = null
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    const onRefreshToken = (force?: boolean) => 
      {
        checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
        disconnectSocket()
        router.push('/login')
      },
      force
    })
  }
    // router.push('refresh-token')
    onRefreshToken()
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000
    interval = setInterval(
      onRefreshToken,
      TIMEOUT
    )

    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    const onRefreshTokenSocket = (data: any) => {
      console.log('refresh-token-socket', data)
      console.log('role', data.role)
      onRefreshToken(true)
    }


    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)
    socket?.on('refresh-token', onRefreshTokenSocket)

    return () => {
      clearInterval(interval)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathname, router, socket])
  return null
}
