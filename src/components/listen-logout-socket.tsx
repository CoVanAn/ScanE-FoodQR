import { useAppStore } from "@/components/app-provider"
import { handleErrorApi } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function ListenLogoutSocket() {
    const pathname = usePathname()
    const router = useRouter()
    const { isPending, mutateAsync } = useLogoutMutation()
    const socket = useAppStore(state => state.socket)
    const setRole = useAppStore(state => state.setRole)
    const disconnectSocket = useAppStore(state => state.disconnectSocket)
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return
        const onLogout = async () => {
            if (isPending) return
            try {
                await mutateAsync()
                setRole()
                disconnectSocket()
                router.push('/')
            } catch (error: any) {
                handleErrorApi({
                    error
                })
            }
        }
        socket?.on('logout', onLogout)
        return () => {
            socket?.off('logout', onLogout)
        }
    }, [socket, pathname, isPending, router,
        mutateAsync, disconnectSocket, setRole])
    return null
}
