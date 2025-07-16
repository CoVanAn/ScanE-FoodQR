'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect } from 'react'
import { useGuestLoginMutation } from '@/queries/useGuest'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useAppStore } from '@/components/app-provider'

export default function GuestLoginForm() {
  const setRole = useAppStore(state => state.setRole)
  const setSocket = useAppStore(state => state.setSocket)
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const tableNumber = Number(params.number)
  const loginMutation = useGuestLoginMutation()
  const token = searchParams.get('token')
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber: tableNumber,
    }
  })

  useEffect(() => {
    console.log('🔍 Debug URL info:', {
      fullURL: window.location.href,
      searchParams: window.location.search,
      token: token,
      tableNumber: tableNumber,
      allSearchParams: Object.fromEntries(searchParams.entries())
    })
    
    if (!token) {
      console.error('⚠️ No table token found in URL, redirecting to home')
      // Tạm thời comment để debug
      // router.push('/')
    } else {
      console.log('✅ Table token found:', token.substring(0, 20) + '...')
      console.log('🏷️ Table number:', tableNumber)
    }
  }, [token, router, tableNumber, searchParams])    
  async function onSubmit(values: GuestLoginBodyType) {
    if (loginMutation.isPending) return
    try {
      // Xóa giỏ hàng cũ trong localStorage khi khách đăng nhập vào bàn
      localStorage.removeItem('cart-items')
      
      const result = await loginMutation.mutateAsync(values)
      setRole(result.payload.data.guest.role)
      setSocket(generateSocketInstance(result.payload.data.accessToken))
      console.log(result.payload.data.guest.name)
      localStorage.setItem('guestName', result.payload.data.guest.name)
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl font-light'>Vui lòng điền tên bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
          className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
           noValidate
           onSubmit = {form.handleSubmit(onSubmit, console.log)}
           >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full bg-[#1c1717] text-white font-semibold rounded-2xl'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
