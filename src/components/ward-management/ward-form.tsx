'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { Ward, WardRequest, Province } from '@/lib/api/client'
import { apiClient } from '@/lib/api/client'

const wardSchema = z.object({
    wardCode: z.string().min(1, 'Mã phường/xã là bắt buộc').max(10, 'Mã phường/xã tối đa 10 ký tự'),
    wardName: z.string().min(1, 'Tên phường/xã là bắt buộc').max(100, 'Tên phường/xã tối đa 100 ký tự'),
    shortName: z.string().max(50, 'Tên viết tắt tối đa 50 ký tự').optional(),
    provinceId: z.string().min(1, 'Tỉnh/thành phố là bắt buộc'),
    isActive: z.boolean().optional(),
})

interface WardFormProps {
    initialData?: Ward
    onSubmit: (data: WardRequest) => void
    isLoading: boolean
}

export function WardForm({ initialData, onSubmit, isLoading }: WardFormProps) {
    const form = useForm<WardRequest>({
        resolver: zodResolver(wardSchema),
        defaultValues: initialData ? {
            wardCode: initialData.wardCode,
            wardName: initialData.wardName,
            shortName: initialData.shortName || '',
            provinceId: initialData.provinceId,
            isActive: initialData.isActive === 1,
        } : {
            wardCode: '',
            wardName: '',
            shortName: '',
            provinceId: '',
            isActive: true,
        },
    })

    const [provinces, setProvinces] = useState<Province[]>([])

    useEffect(() => {
        async function fetchProvinces() {
            const res = await apiClient.getProvinces()
            if (res.success && res.data) {
                setProvinces(res.data.items)
            }
        }
        fetchProvinces()
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="wardCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã phường/xã</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập mã phường/xã" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="wardName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên phường/xã</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên phường/xã" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên viết tắt</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên viết tắt" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="provinceId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem key={province.id} value={province.id}>
                                            {province.provinceName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Phường/xã này có đang hoạt động không?
                                </div>
                            </div>
                            <FormControl>
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full medical-gradient" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Cập nhật phường/xã' : 'Tạo phường/xã'}
                </Button>
            </form>
        </Form>
    )
}
