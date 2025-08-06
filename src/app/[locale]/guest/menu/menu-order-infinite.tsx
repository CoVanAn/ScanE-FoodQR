'use client'
import { Button } from '@/components/ui/button'
import { useDishInfiniteQuery } from '@/queries/useDish'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useRouter } from '@/i18n/navigation'
import { DishStatus } from '@/constants/type'
import { useCart } from '@/lib/hooks/useCartContext'
import { toast } from 'sonner'
import { useCategoryListQuery } from '@/queries/useCategory'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Lazy load DishItem component
const DishItem = dynamic(() => import('./dish-item'), {
    loading: () => (
        <div className="flex gap-3 px-6 sm:px-0">
            <div className="w-[80px] h-[80px] bg-muted animate-pulse rounded-md"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
            </div>
            <div className="w-16 h-6 bg-muted animate-pulse rounded"></div>
        </div>
    )
})

export default function MenuOrderInfinite() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])

    const router = useRouter()
    const { addToCart } = useCart()
    const { data: categoryData } = useCategoryListQuery()
    const categories = categoryData?.payload.data ?? []

    // Infinite query with category filter
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useDishInfiniteQuery(
        selectedCategory ? parseInt(selectedCategory) : null,
        8 // limit per page
    )

    // Intersection observer for infinite scroll
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px' // Load more when 100px before reaching the end
    })

    // Fetch more when in view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    // Flatten all pages data
    // CLIENT lưu trữ TẤT CẢ pages đã load:
    const dishes = useMemo(() => {
        return data?.pages?.flatMap(page => page.payload.data) ?? []
        //           ↑ Merge tất cả pages thành 1 array
    }, [data])
    // data.pages structure:
    // [
    //   { payload: { data: [dish1-8], pagination: {...} } },     // page 1
    //   { payload: { data: [dish9-16], pagination: {...} } },    // page 2  
    //   { payload: { data: [dish17-24], pagination: {...} } },   // page 3
    // ]

    // dishes = [dish1, dish2, ..., dish24] ← Flattened array

    // Calculate total price
    const totalPrice = useMemo(() => {
        return dishes.reduce((result, dish) => {
            const order = orders.find((order) => order.dishId === dish.id)
            if (!order) return result
            return result + order.quantity * dish.price
        }, 0)
    }, [dishes, orders])

    const handleQuantityChange = useCallback((dishId: number, quantity: number) => {
        setOrders((prevOrders) => {
            if (quantity === 0) {
                return prevOrders.filter((order) => order.dishId !== dishId)
            }
            const index = prevOrders.findIndex((order) => order.dishId === dishId)
            if (index === -1) {
                return [...prevOrders, { dishId, quantity }]
            }
            const newOrders = [...prevOrders]
            newOrders[index] = { ...newOrders[index], quantity }
            return newOrders
        })
    }, [])

    const handleAddToCart = () => {
        addToCart(orders)
        toast.success(`Đã thêm ${orders.length} món vào giỏ hàng`)
        setOrders([])
        router.push('/guest/cart')
    }

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value === 'all' ? null : value)
        // Reset orders when changing category and page = 1 with new category
        setOrders([])
    }

    if (isError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Có lỗi xảy ra khi tải menu</p>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="mt-2"
                >
                    Thử lại
                </Button>
            </div>
        )
    }

    return (
        <>
            {/* Category Filter */}
            <div className="flex flex-col items-center gap-2 mb-6">
                <div className="w-full flex flex-col items-center gap-2">
                    <div className="flex gap-2 items-center w-full justify-center">
                        <Select
                            value={selectedCategory || 'all'}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="w-56 border-primary shadow-sm focus:ring-2 focus:ring-primary/50">
                                <SelectValue placeholder="Chọn danh mục..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-auto">
                                <SelectItem value="all">Tất cả các món</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Loading state for initial load */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex gap-3 px-6 sm:px-0">
                            <div className="w-[80px] h-[80px] bg-muted animate-pulse rounded-md"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                                <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
                                <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                            </div>
                            <div className="w-16 h-6 bg-muted animate-pulse rounded"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Menu Items */}
            {!isLoading && (
                <div className="space-y-4">
                    {dishes
                        .filter((dish) => dish.status !== DishStatus.Hidden)
                        .map((dish) => {
                            const order = orders.find((order) => order.dishId === dish.id)
                            return (
                                <DishItem
                                    key={dish.id}
                                    dish={dish}
                                    quantity={order?.quantity ?? 0}
                                    onQuantityChange={handleQuantityChange}
                                />
                            )
                        })}

                    {/* Load more trigger */}
                    {hasNextPage && (
                        <div
                            ref={ref}
                            className="flex justify-center py-4"
                        >
                            {isFetchingNextPage ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Đang tải thêm món...</span>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    Tải thêm món ăn
                                </Button>
                            )}
                        </div>
                    )}

                    {/* End of list message */}
                    {!hasNextPage && dishes.length > 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                            {/* 🎉 Bạn đã xem hết tất cả các món! */}
                        </div>
                    )}

                    {/* Empty state */}
                    {!hasNextPage && dishes.length === 0 && !isLoading && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Không có món ăn nào trong danh mục này</p>
                        </div>
                    )}
                </div>
            )}

            {/* Sticky Add to Cart Button */}
            {orders.length > 0 && (
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
                    <div className="max-w-[400px] mx-auto">
                        <Button
                            onClick={handleAddToCart}
                            className="w-full h-12 text-base font-medium"
                            size="lg"
                        >
                            Thêm vào giỏ hàng • {orders.length} món • {formatCurrency(totalPrice)}
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
