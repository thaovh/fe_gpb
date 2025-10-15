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
import { apiClient, Department, DepartmentRequest, Branch, DepartmentType } from '@/lib/api/client'

const departmentSchema = z.object({
    departmentCode: z.string().min(1, 'Mã khoa là bắt buộc').max(20, 'Mã khoa tối đa 20 ký tự'),
    departmentName: z.string().min(1, 'Tên khoa là bắt buộc').max(100, 'Tên khoa tối đa 100 ký tự'),
    branchId: z.string().min(1, 'Chi nhánh là bắt buộc'),
    headOfDepartment: z.string().max(100, 'Trưởng khoa tối đa 100 ký tự').optional(),
    headNurse: z.string().max(100, 'Điều dưỡng trưởng tối đa 100 ký tự').optional(),
    parentDepartmentId: z.string().optional(),
    shortName: z.string().max(50, 'Tên viết tắt tối đa 50 ký tự').optional(),
    departmentTypeId: z.string().optional(),
    isActive: z.boolean().default(true),
})

type DepartmentFormData = z.infer<typeof departmentSchema>

interface DepartmentFormProps {
    initialData?: Department
    onSubmit: (data: DepartmentRequest) => void
    isLoading?: boolean
}

export function DepartmentForm({ initialData, onSubmit, isLoading = false }: DepartmentFormProps) {
    const [branches, setBranches] = useState<Branch[]>([])
    const [departmentTypes, setDepartmentTypes] = useState<DepartmentType[]>([])
    const [departments, setDepartments] = useState<Department[]>([])

    const form = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            departmentCode: initialData?.departmentCode || '',
            departmentName: initialData?.departmentName || '',
            branchId: initialData?.branchId || '',
            headOfDepartment: initialData?.headOfDepartment || '',
            headNurse: initialData?.headNurse || '',
            parentDepartmentId: initialData?.parentDepartmentId || '',
            shortName: initialData?.shortName || '',
            departmentTypeId: initialData?.departmentTypeId || '',
            isActive: initialData?.isActiveFlag === 1,
        },
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const [branchesRes, departmentTypesRes, departmentsRes] = await Promise.all([
                    apiClient.getBranches(),
                    apiClient.getDepartmentTypes(),
                    apiClient.getDepartments(),
                ])

                if (branchesRes.success && branchesRes.data) {
                    setBranches(branchesRes.data.items)
                }
                if (departmentTypesRes.success && departmentTypesRes.data) {
                    setDepartmentTypes(departmentTypesRes.data.items)
                }
                if (departmentsRes.success && departmentsRes.data) {
                    setDepartments(departmentsRes.data.items)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    function handleSubmit(data: DepartmentFormData) {
        onSubmit(data)
    }

    const selectedBranchId = form.watch('branchId')
    const filteredDepartments = selectedBranchId
        ? departments.filter(dept => dept.branchId === selectedBranchId && dept.id !== initialData?.id)
        : []

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="departmentCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã khoa *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập mã khoa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departmentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên khoa *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên khoa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="branchId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chi nhánh *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn chi nhánh" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id}>
                                                {branch.branchName}
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
                        name="departmentTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại khoa</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại khoa" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {departmentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.typeName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="headOfDepartment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trưởng khoa</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên trưởng khoa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="headNurse"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Điều dưỡng trưởng</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên điều dưỡng trưởng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="parentDepartmentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Khoa cha</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBranchId}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn khoa cha (tùy chọn)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredDepartments.map((department) => (
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
                    {initialData ? 'Cập nhật khoa' : 'Tạo khoa'}
                </Button>
            </form>
        </Form>
    )
}
