import guestApiRequest from '@/apiRequests/guest'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}

export const useGuestOrderMutation = () => {
  // const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guestApiRequest.order,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ['guest-orders']
    //   })
    // }
  })
}

export const useGuestGetOrderListQuery = () => {
  console.log('useGuestGetOrderListQuery')
  return useQuery({
    queryFn: guestApiRequest.getOrderList,
    queryKey: ['guest-orders'],
    refetchOnMount: true
  })
}
