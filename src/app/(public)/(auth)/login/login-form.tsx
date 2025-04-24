'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import { handleErrorApi, removeTokensFromLocalStorage } from '@/lib/utils'
import { Eye, EyeOff } from "lucide-react"; // Import icon từ lucide-react
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/components/app-provider'

export default function LoginForm() {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const searchParams = useSearchParams()
  const {setRole} = useAppContext()
  const clearToken = searchParams.get('clearToken')
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (clearToken) {
      setRole()
    }
  }, [clearToken, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    //Khi nhấn submit thì React hook form sẽ tự động gọi hàm onSubmit
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast("", {
        description: result?.payload?.message,
        action: {
          label: "x",
          onClick: () => console.log("Undo"),
        },
      })
      setRole(result.payload.data.account.role)
      router.push('/manage/dashboard')
    }
    catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  const [showPassword, setShowPassword] = React.useState(false)
  const togglePassword = () => setShowPassword(!showPassword);


  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu  để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, err => {
              console.warn(err)
            })}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <div className="relative">
                        <Input {...field} type={showPassword ? "text" : "password"} />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={togglePassword}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
              <Button variant='outline' className='w-full' type='button'>
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
