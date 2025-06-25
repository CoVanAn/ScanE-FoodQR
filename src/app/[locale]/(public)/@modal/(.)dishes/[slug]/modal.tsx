'use client'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
// import { useRouter } from "next/navigation";
import { useRouter} from '@/i18n/navigation'

export default function Modal({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    return (
        <>
            <Dialog open onOpenChange={(open) => {
                if (!open) {
                    router.back()
                }
            }}>
                <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px]">
                    <DialogTitle>Thông tin </DialogTitle>
                    {children}
                    <DialogDescription>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    )
}