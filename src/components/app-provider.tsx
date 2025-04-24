'use client'

import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { use, useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import { set } from 'zod'


const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
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
})

export const useAppContext = () => {
    return useContext(AppContext)
}

export default function AppProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [role, setRoleState] = useState<RoleType | undefined>()
    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            const role = decodeToken(accessToken).role
            setRoleState(role)
        }
    }, [])

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
            role, setRole, isAuth
        }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>
    )
}