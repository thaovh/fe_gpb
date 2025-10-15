'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { apiClient, Department, DepartmentRequest, DepartmentFilters } from '@/lib/api/client'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Users,
  MapPin
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DepartmentForm } from './department-form'

export function DepartmentTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch branches for filter
  const { data: branchesData } = useQuery({
    queryKey: ['branches'],
    queryFn: () => apiClient.getBranches(),
  })

  const branches = branchesData?.data?.items || []

  // Build filters
  const filters: DepartmentFilters = {
    search: searchTerm || undefined,
    branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : undefined,
    isActive: selectedStatus && selectedStatus !== 'all' ? selectedStatus === 'active' : undefined,
    limit: pageSize,
    offset: currentPage * pageSize,
  }

  // Fetch departments
  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments', filters],
    queryFn: () => apiClient.getDepartments(filters),
  })

  const createMutation = useMutation({
    mutationFn: (newDepartment: DepartmentRequest) => apiClient.createDepartment(newDepartment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast({
        title: 'Thành công',
        description: 'Khoa đã được tạo thành công',
      })
      setIsCreateDialogOpen(false)
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo khoa',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DepartmentRequest> }) =>
      apiClient.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast({
        title: 'Thành công',
        description: 'Khoa đã được cập nhật thành công',
      })
      setIsCreateDialogOpen(false)
      setEditingDepartment(null)
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật khoa',
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast({
        title: 'Thành công',
        description: 'Khoa đã được xóa thành công',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa khoa',
        variant: 'destructive',
      })
    },
  })

  const handleCreateDepartment = (data: DepartmentRequest) => {
    createMutation.mutate(data)
  }

  const handleUpdateDepartment = (data: DepartmentRequest) => {
    if (editingDepartment) {
      updateMutation.mutate({ id: editingDepartment.id, data })
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsCreateDialogOpen(true)
  }

  function handleDeleteDepartment(department: Department) {
    setDepartmentToDelete(department)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteMutation.mutate(departmentToDelete.id)
      setDeleteDialogOpen(false)
      setDepartmentToDelete(null)
    }
  }

  const totalPages = departments?.data ? Math.ceil(departments.data.total / pageSize) : 0

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <CardTitle className="text-xl font-semibold text-red-600">Lỗi tải dữ liệu</CardTitle>
          <CardDescription className="text-red-500">
            Không thể tải dữ liệu khoa. Vui lòng thử lại sau.
          </CardDescription>
          <p className="mt-2 text-sm text-red-700">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Quản lý khoa</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDepartment(null)} className="medical-gradient">
                <Plus className="mr-2 h-4 w-4" /> Thêm khoa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDepartment ? 'Cập nhật khoa' : 'Tạo khoa mới'}</DialogTitle>
                <DialogDescription>
                  {editingDepartment ? 'Chỉnh sửa thông tin khoa.' : 'Điền thông tin để tạo khoa mới.'}
                </DialogDescription>
              </DialogHeader>
              {editingDepartment ? (
                <DepartmentForm
                  initialData={editingDepartment}
                  onSubmit={handleUpdateDepartment}
                  isLoading={updateMutation.isPending}
                />
              ) : (
                <DepartmentForm
                  onSubmit={handleCreateDepartment}
                  isLoading={createMutation.isPending}
                />
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tất cả chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thông tin</TableHead>
                      <TableHead>Chi nhánh</TableHead>
                      <TableHead>Loại khoa</TableHead>
                      <TableHead>Nhân sự</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments?.data?.items?.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-medical-100 rounded-full">
                              <Building2 className="h-4 w-4 text-medical-600" />
                            </div>
                            <div>
                              <div className="font-medium">{department.departmentName}</div>
                              <div className="text-sm text-muted-foreground">{department.departmentCode}</div>
                              {department.shortName && (
                                <div className="text-xs text-muted-foreground">({department.shortName})</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {department.branch?.branchName || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {department.departmentType?.typeName || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {department.headOfDepartment && (
                              <div className="flex items-center text-sm">
                                <User className="h-3 w-3 mr-1" />
                                {department.headOfDepartment}
                              </div>
                            )}
                            {department.headNurse && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {department.headNurse}
                              </div>
                            )}
                            {!department.headOfDepartment && !department.headNurse && (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            department.isActiveFlag === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {department.isActiveFlag === 1 ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(department)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDepartment(department)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {departments?.data?.items?.length || 0} trong tổng số {departments?.data?.total || 0} khoa
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Trang {currentPage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khoa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khoa &quot;{departmentToDelete?.departmentName}&quot;? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
