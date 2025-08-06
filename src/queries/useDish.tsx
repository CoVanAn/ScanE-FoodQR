import dishApiRequest from '@/apiRequests/dish'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'

export const useDishListQuery = (categoryId?: number | null) => {
  return useQuery({
    queryKey: categoryId ? ['dishes', 'category', categoryId] : ['dishes'],
    queryFn: () => dishApiRequest.listByCategory(categoryId || null)
  })
}

export const useDishInfiniteQuery = (categoryId?: number | null, limit = 8) => {
  return useInfiniteQuery({
    queryKey: categoryId ? ['dishes', 'infinite', 'category', categoryId] : ['dishes', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      dishApiRequest.listPaginated({ page: pageParam, limit, categoryId: categoryId || undefined }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.payload.pagination
      return pagination?.hasMore ? pagination.page + 1 : undefined
      //     ↑ Nếu page=2, hasMore=true → return 3
      //     ↑ Nếu page=6, hasMore=false → return undefined (stop)
    }
  })
}

export const useGetDishQuery = ({
  id,
  enabled
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: (data) => {
      // Invalidate main dishes query
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })

      // Invalidate category-specific query if dish has a category
      const categoryId = data.payload.data.categoryId
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: ['dishes', 'category', categoryId]
        })
      }

      // Also invalidate all category queries to ensure consistent UI 
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'dishes' &&
          query.queryKey[1] === 'category'
      })
    }
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: (data, variables) => {
      // Invalidate main dishes query
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
        exact: true
      })

      // Invalidate dish detail query
      queryClient.invalidateQueries({
        queryKey: ['dishes', variables.id]
      })

      // Invalidate category-specific queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'dishes' &&
          query.queryKey[1] === 'category'
      })
    }
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dishApiRequest.deleteDish(id),
    onSuccess: () => {
      // Invalidate main dishes query
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })

      // Invalidate all category-specific queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'dishes' &&
          query.queryKey[1] === 'category'
      })
    }
  })
}
