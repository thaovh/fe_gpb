'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useHisIntegration } from '@/hooks/use-his'
import { Loader2, Shield, Building2, CheckCircle } from 'lucide-react'

const loginSchema = z.object({
    usernameOrEmail: z.string().min(1, 'Tên đăng nhập hoặc email là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

const hisLoginSchema = z.object({
    username: z.string().min(1, 'Tên đăng nhập HIS là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu HIS là bắt buộc'),
})

type LoginFormData = z.infer<typeof loginSchema>
type HisLoginFormData = z.infer<typeof hisLoginSchema>

export function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('jwt')
    const router = useRouter()
    const { toast } = useToast()
    const { login } = useAuthStore()
    const {
        hisLoginWithCredentials,
        isLoggingInWithCredentials: isHisLoggingInWithCredentials,
        token: hisToken,
        tokenStatus,
        isLoggedIn: isHisLoggedIn
    } = useHisIntegration()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            usernameOrEmail: '',
            password: '',
        },
    })

    const hisForm = useForm<HisLoginFormData>({
        resolver: zodResolver(hisLoginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true)

        try {
            // Call real API using API client
            const { apiClient } = await import('@/lib/api/client')
            const result = await apiClient.login({
                usernameOrEmail: data.usernameOrEmail,
                password: data.password,
            })

            if (result.success && result.data) {
                // Store in auth store (API client already has token from login method)
                login(result.data.accessToken, result.data.refreshToken, {
                    id: result.data.user.id,
                    username: result.data.user.username,
                    email: result.data.user.email,
                    fullName: result.data.user.fullName,
                    role: result.data.user.role,
                    isActive: result.data.user.isActive,
                    lastLoginAt: result.data.user.lastLoginAt,
                })

                toast({
                    title: 'Đăng nhập thành công',
                    description: `Chào mừng ${result.data.user.username}!`,
                })

                router.push('/dashboard')
            } else {
                // Don't throw error, let catch block handle it
                throw result
            }
        } catch (error) {
            console.error('Login error:', error)
            console.error('Error type:', typeof error)

            if (error && typeof error === 'object') {
                console.error('Error keys:', Object.keys(error))
                console.error('Error values:', Object.values(error))
                console.error('Full error object:', JSON.stringify(error, null, 2))
            }

            let errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại'

            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            } else if (error && typeof error === 'object') {
                // Handle API response error
                if ('error' in error && error.error) {
                    if (typeof error.error === 'object' && 'message' in error.error) {
                        errorMessage = String(error.error.message)
                    } else {
                        errorMessage = String(error.error)
                    }
                } else if ('message' in error && error.message) {
                    errorMessage = String(error.message)
                } else {
                    errorMessage = 'Đăng nhập thất bại - Vui lòng kiểm tra console để xem chi tiết'
                }
            }

            toast({
                title: 'Đăng nhập thất bại',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }


    function handleHisLoginWithCredentials(data: HisLoginFormData) {
        console.log('HIS Login attempt with:', { username: data.username, password: '***' })
        hisLoginWithCredentials({
            username: data.username,
            password: data.password,
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <Card className="w-full max-w-md medical-shadow">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-medical-500 rounded-full">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-medical-900">
                        Bạch Mai LIS GPB
                    </CardTitle>
                    <CardDescription className="text-medical-600">
                        Hệ thống quản lý thông tin phòng xét nghiệm
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="jwt" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                JWT Login
                            </TabsTrigger>
                            <TabsTrigger value="his" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                HIS Login
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="jwt" className="space-y-4 mt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="usernameOrEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên đăng nhập hoặc Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập tên đăng nhập hoặc email"
                                                        {...field}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Nhập mật khẩu"
                                                        {...field}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full medical-gradient"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang đăng nhập...
                                            </>
                                        ) : (
                                            'Đăng nhập JWT'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="his" className="space-y-4 mt-6">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Building2 className="h-12 w-12 text-medical-500 mx-auto mb-2" />
                                    <h3 className="text-lg font-semibold">Đăng nhập HIS</h3>
                                    <p className="text-sm text-gray-600">
                                        Đăng nhập trực tiếp vào hệ thống HIS của bệnh viện
                                    </p>
                                </div>

                                {/* HIS Token Status */}
                                {isHisLoggedIn && hisToken && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm font-medium">Đã đăng nhập HIS</span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">
                                            User: {hisToken.userName} ({hisToken.userLoginName})
                                        </p>
                                        {tokenStatus && (
                                            <p className="text-xs text-green-600">
                                                Token còn hiệu lực: {tokenStatus.minutesUntilExpire} phút
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* HIS Login Form */}
                                <Form {...hisForm}>
                                    <form onSubmit={hisForm.handleSubmit(handleHisLoginWithCredentials)} className="space-y-4">
                                        <FormField
                                            control={hisForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tên đăng nhập HIS</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nhập tên đăng nhập HIS"
                                                            {...field}
                                                            disabled={isHisLoggingInWithCredentials}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={hisForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mật khẩu HIS</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Nhập mật khẩu HIS"
                                                            {...field}
                                                            disabled={isHisLoggingInWithCredentials}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full medical-gradient"
                                            disabled={isHisLoggingInWithCredentials}
                                        >
                                            {isHisLoggingInWithCredentials && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Building2 className="mr-2 h-4 w-4" />
                                            Đăng nhập HIS
                                        </Button>
                                    </form>
                                </Form>

                                <div className="text-xs text-gray-500 text-center">
                                    <p>Đăng nhập trực tiếp vào hệ thống HIS</p>
                                    <p>Không cần đăng nhập JWT trước</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
