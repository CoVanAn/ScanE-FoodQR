'use client'

import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
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
    setIsAuth: (isAuth: boolean) => { },
})

export const useAppContext = () => {
    return useContext(AppContext)
}

export default function AppProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    const [isAuth, setIsAuthState] = useState(false)
    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            setIsAuthState(true)
        }
    }, [])

    //Nếu dùng react 19 và next 15 thì ko cần dùng useCallBack đoạn này cx đc
    const setIsAuth = (isAuth: boolean) => {
        if (isAuth) {
            setIsAuthState(true)
        }
        else {
            setIsAuthState(false)
            removeTokensFromLocalStorage()
        }
    }
    //Nếu dùng react 19 và next 15 thì ko cần appcontext.provider, chỉ cần appcontext là đủ
    return (
        <AppContext value={{
            isAuth, setIsAuth
        }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>
    )
}