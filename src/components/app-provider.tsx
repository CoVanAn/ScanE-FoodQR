'use client'

import { decodeToken, generateSocketInstance, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import {QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, {  useCallback, useEffect, useRef } from 'react'
import { createContext, useContext, useState } from 'react'
import RefreshToken from './refresh-token'
import type { Socket } from 'socket.io-client'

const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                // refetchOnMount: false,
            },
            mutations: {
                retry: false,
            },
        },
    }
)

const AppContext = createContext({
    isAuth: false,
    role: undefined as RoleType | undefined,
    setRole: (role?: RoleType | undefined) => { },
    socket: undefined as Socket | undefined,
    setSocket: (socket?: Socket | undefined) => { },
    disconnectSocket: () => { },
})

export const useAppContext = () => {
    return useContext(AppContext)
}

export default function AppProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [socket, setSocket] = useState<Socket | undefined>()
    const [role, setRoleState] = useState<RoleType | undefined>()
    const count = useRef(0)
    useEffect(() => {
        if(count.current === 0) {
            const accessToken = getAccessTokenFromLocalStorage()
            if (accessToken) {
                const role = decodeToken(accessToken).role
                setRoleState(role)
                setSocket(generateSocketInstance(accessToken))
            }
        }
        count.current++
    }, [])

    const disconnectSocket = useCallback(() => {
        socket?.disconnect()
        setSocket(undefined)
    }, [socket, setSocket])

    //Nếu dùng react 19 và next 15 thì ko cần dùng useCallBack đoạn này cx đc
    const setRole = (role?: RoleType | undefined) => {
        setRoleState(role)
        if (!role) {
            removeTokensFromLocalStorage()
        }
    }
    const isAuth = Boolean(role)
    //Nếu dùng react 19 và next 15 thì ko cần appcontext.provider, chỉ cần appcontext là đủ
    return (
        <AppContext value={{
            role, setRole, isAuth, socket, setSocket, disconnectSocket
        }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshToken />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>
    )
}