'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { apiClient, Room, RoomRequest, Department } from '@/lib/api/client'

const roomSchema = z.object({
    roomCode: z.string().min(1, 'Mã phòng là bắt buộc').max(20, 'Mã phòng tối đa 20 ký tự'),
    roomName: z.string().min(1, 'Tên phòng là bắt buộc').max(100, 'Tên phòng tối đa 100 ký tự'),
    roomAddress: z.string().max(200, 'Địa chỉ phòng tối đa 200 ký tự').optional(),
    departmentId: z.string().min(1, 'Khoa là bắt buộc'),
    description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional(),
    isActive: z.boolean().default(true),
})

type RoomFormData = z.infer<typeof roomSchema>

interface RoomFormProps {
    initialData?: Room
    onSubmit: (data: RoomRequest) => void
    isLoading?: boolean
}

export function RoomForm({ initialData, onSubmit, isLoading = false }: RoomFormProps) {
    const [departments, setDepartments] = useState<Department[]>([])

    const form = useForm<RoomFormData>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            roomCode: initialData?.roomCode || '',
            roomName: initialData?.roomName || '',
            roomAddress: initialData?.roomAddress || '',
            departmentId: initialData?.departmentId || '',
            description: initialData?.description || '',
            isActive: initialData?.isActiveFlag === 1,
        },
    })

    useEffect(() => {
        async function fetchDepartments() {
            try {
                const departmentsRes = await apiClient.getDepartments()
                if (departmentsRes.success && departmentsRes.data) {
                    setDepartments(departmentsRes.data.items)
                }
            } catch (error) {
                console.error('Error fetching departments:', error)
            }
        }

        fetchDepartments()
    }, [])

    function handleSubmit(data: RoomFormData) {
        onSubmit(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="roomCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã phòng *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập mã phòng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roomName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên phòng *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên phòng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="roomAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Địa chỉ phòng</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập địa chỉ phòng" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Khoa *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn khoa" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departments.map((department) => (
                                        <SelectItem key={department.id} value={department.id}>
                                            {department.departmentName}
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập mô tả phòng" {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value ? 'true' : 'false'}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="true">Hoạt động</SelectItem>
                                    <SelectItem value="false">Không hoạt động</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full medical-gradient" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Cập nhật phòng' : 'Tạo phòng'}
                </Button>
            </form>
        </Form>
    )
}
