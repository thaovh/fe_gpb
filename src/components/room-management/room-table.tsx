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
import { apiClient, Room, RoomRequest, RoomFilters } from '@/lib/api/client'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Home,
    Building2,
    MapPin
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RoomForm } from './room-form'

export function RoomTable() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingRoom, setEditingRoom] = useState<Room | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize] = useState(10)

    const { toast } = useToast()
    const queryClient = useQueryClient()

    // Fetch departments for filter
    const { data: departmentsData } = useQuery({
        queryKey: ['departments'],
        queryFn: () => apiClient.getDepartments(),
    })

    const departments = departmentsData?.data?.items || []

    // Build filters
    const filters: RoomFilters = {
        search: searchTerm || undefined,
        departmentId: selectedDepartment && selectedDepartment !== 'all' ? selectedDepartment : undefined,
        isActive: selectedStatus && selectedStatus !== 'all' ? selectedStatus === 'active' : undefined,
        limit: pageSize,
        offset: currentPage * pageSize,
    }

    // Fetch rooms
    const { data: rooms, isLoading, error } = useQuery({
        queryKey: ['rooms', filters],
        queryFn: () => apiClient.getRooms(filters),
    })

    const createMutation = useMutation({
        mutationFn: (newRoom: RoomRequest) => apiClient.createRoom(newRoom),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            toast({
                title: 'Thành công',
                description: 'Phòng đã được tạo thành công',
            })
            setIsCreateDialogOpen(false)
        },
        onError: (error: Error) => {
            toast({
                title: 'Lỗi',
                description: error.message || 'Không thể tạo phòng',
                variant: 'destructive',
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<RoomRequest> }) =>
            apiClient.updateRoom(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            toast({
                title: 'Thành công',
                description: 'Phòng đã được cập nhật thành công',
            })
            setIsCreateDialogOpen(false)
            setEditingRoom(null)
        },
        onError: (error: Error) => {
            toast({
                title: 'Lỗi',
                description: error.message || 'Không thể cập nhật phòng',
                variant: 'destructive',
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient.deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            toast({
                title: 'Thành công',
                description: 'Phòng đã được xóa thành công',
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Lỗi',
                description: error.message || 'Không thể xóa phòng',
                variant: 'destructive',
            })
        },
    })

    const handleCreateRoom = (data: RoomRequest) => {
        createMutation.mutate(data)
    }

    const handleUpdateRoom = (data: RoomRequest) => {
        if (editingRoom) {
            updateMutation.mutate({ id: editingRoom.id, data })
        }
    }

    const handleEdit = (room: Room) => {
        setEditingRoom(room)
        setIsCreateDialogOpen(true)
    }

    function handleDeleteRoom(room: Room) {
        setRoomToDelete(room)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (roomToDelete) {
            deleteMutation.mutate(roomToDelete.id)
            setDeleteDialogOpen(false)
            setRoomToDelete(null)
        }
    }

    const totalPages = rooms?.data ? Math.ceil(rooms.data.total / pageSize) : 0

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold text-red-600">Lỗi tải dữ liệu</CardTitle>
                    <CardDescription className="text-red-500">
                        Không thể tải dữ liệu phòng. Vui lòng thử lại sau.
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
                    <CardTitle className="text-2xl font-bold">Quản lý phòng</CardTitle>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingRoom(null)} className="medical-gradient">
                                <Plus className="mr-2 h-4 w-4" /> Thêm phòng
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{editingRoom ? 'Cập nhật phòng' : 'Tạo phòng mới'}</DialogTitle>
                                <DialogDescription>
                                    {editingRoom ? 'Chỉnh sửa thông tin phòng.' : 'Điền thông tin để tạo phòng mới.'}
                                </DialogDescription>
                            </DialogHeader>
                            {editingRoom ? (
                                <RoomForm
                                    initialData={editingRoom}
                                    onSubmit={handleUpdateRoom}
                                    isLoading={updateMutation.isPending}
                                />
                            ) : (
                                <RoomForm
                                    onSubmit={handleCreateRoom}
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
                                placeholder="Tìm kiếm theo tên hoặc mã phòng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Tất cả khoa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả khoa</SelectItem>
                                {departments.map((department) => (
                                    <SelectItem key={department.id} value={department.id}>
                                        {department.departmentName}
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
                                            <TableHead>Khoa</TableHead>
                                            <TableHead>Địa chỉ</TableHead>
                                            <TableHead>Mô tả</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rooms?.data?.items?.map((room) => (
                                            <TableRow key={room.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-medical-100 rounded-full">
                                                            <Home className="h-4 w-4 text-medical-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{room.roomName}</div>
                                                            <div className="text-sm text-muted-foreground">{room.roomCode}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {room.department ? (
                                                        <div className="flex items-center text-sm">
                                                            <Building2 className="h-3 w-3 mr-1" />
                                                            {room.department.departmentName}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {room.roomAddress ? (
                                                        <div className="flex items-center text-sm">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            {room.roomAddress}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {room.description || '-'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.isActiveFlag === 1
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {room.isActiveFlag === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(room)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteRoom(room)}
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
                                        Hiển thị {rooms?.data?.items?.length || 0} trong tổng số {rooms?.data?.total || 0} phòng
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
                        <DialogTitle>Xác nhận xóa phòng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa phòng &quot;{roomToDelete?.roomName}&quot;?
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
