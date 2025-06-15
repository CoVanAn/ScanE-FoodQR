'use client'

import { decodeToken, generateSocketInstance, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import RefreshToken from './refresh-token'
import type { Socket } from 'socket.io-client'
import ListenLogoutSocket from './listen-logout-socket'
import { create } from 'zustand'
// import { set } from 'date-fns'

const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
            },
        },
    }
)

type AppStore = {
    isAuth: boolean
    role: RoleType | undefined
    setRole: (role?: RoleType | undefined) => void
    socket: Socket | undefined
    setSocket: (socket?: Socket | undefined) => void
    disconnectSocket: () => void
}

export const useAppStore = create<AppStore>((set) => ({
    isAuth: false,
    role: undefined as RoleType | undefined,
    setRole: (role?: RoleType | undefined) => {
        set({ role, isAuth: Boolean(role) })
        if (!role) {
            removeTokensFromLocalStorage()
        }
    },
    socket: undefined as Socket | undefined,
    setSocket: (socket?: Socket | undefined) => { set({ socket }) },
    disconnectSocket: () => set(state => {
        state.socket?.disconnect()
        return { socket: undefined }
    }),
}))

export default function AppProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {

    const setRole = useAppStore((state) => state.setRole)
    const setSocket = useAppStore((state) => state.setSocket)
    const count = useRef(0)

    useEffect(() => {
        if (count.current === 0) {
            const accessToken = getAccessTokenFromLocalStorage()
            if (accessToken) {
                const role = decodeToken(accessToken).role
                setRole(role)
                setSocket(generateSocketInstance(accessToken))
            }
        }
        count.current++
    }, [setRole, setSocket])

    // const disconnectSocket = useCallback(() => {
    //     socket?.disconnect()
    //     setSocket(undefined)
    // }, [socket, setSocket])

    //Nếu dùng react 19 và next 15 thì ko cần dùng useCallBack đoạn này cx đc
 
    // const isAuth = Boolean(role)
    //Nếu dùng react 19 và next 15 thì ko cần appcontext.provider, chỉ cần appcontext là đủ
    return (
        // <AppContext value={{
        //     role, setRole, isAuth, socket, setSocket, disconnectSocket
        // }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshToken />
                <ListenLogoutSocket />
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                {/* Đã xóa ReactQueryDevtools để ẩn icon tanstack */}
            </QueryClientProvider>
        // </AppContext>
    )
}