'use client'

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


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

export default function AppProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />

        </QueryClientProvider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
  }