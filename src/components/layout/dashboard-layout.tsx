'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    User,
    Building2,
    ChevronDown,
    MapPin,
    Home,
    UserCheck,
    Building,
    Stethoscope,
    Package,
    Ruler,
    TestTube
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            description: 'Tổng quan hệ thống và thống kê'
        },
        {
            name: 'Danh mục',
            icon: Users,
            description: 'Quản lý dữ liệu cơ bản và danh mục hệ thống',
            children: [
                {
                    name: 'Tỉnh/Thành phố',
                    href: '/provinces',
                    icon: MapPin,
                    description: 'Quản lý danh sách tỉnh thành phố'
                },
                {
                    name: 'Phường/Xã',
                    href: '/wards',
                    icon: Home,
                    description: 'Quản lý danh sách phường xã theo tỉnh'
                },
                {
                    name: 'Chi nhánh',
                    href: '/branches',
                    icon: Building2,
                    description: 'Quản lý các chi nhánh bệnh viện'
                },
                {
                    name: 'Loại khoa',
                    href: '/department-types',
                    icon: Building,
                    description: 'Quản lý các loại khoa phòng'
                },
                {
                    name: 'Khoa',
                    href: '/departments',
                    icon: Building2,
                    description: 'Quản lý khoa phòng theo chi nhánh'
                },
                {
                    name: 'Phòng',
                    href: '/rooms',
                    icon: Home,
                    description: 'Quản lý phòng theo khoa'
                },
                {
                    name: 'Nhóm dịch vụ',
                    href: '/service-groups',
                    icon: Package,
                    description: 'Quản lý nhóm dịch vụ y tế'
                },
                {
                    name: 'Đơn vị tính',
                    href: '/unit-of-measures',
                    icon: Ruler,
                    description: 'Quản lý đơn vị đo lường'
                },
                {
                    name: 'Dịch vụ',
                    href: '/services',
                    icon: Stethoscope,
                    description: 'Quản lý dịch vụ y tế và giá cả'
                },
                {
                    name: 'Loại mẫu',
                    href: '/sample-types',
                    icon: TestTube,
                    description: 'Quản lý loại mẫu xét nghiệm'
                },
                {
                    name: 'Danh mục chung',
                    href: '/categories',
                    icon: Users,
                    description: 'Quản lý danh mục chung hệ thống'
                },
            ]
        },
        {
            name: 'Quản lý nhân sự',
            icon: UserCheck,
            description: 'Quản lý người dùng và phân quyền hệ thống',
            children: [
                {
                    name: 'Người dùng',
                    href: '/users',
                    icon: UserCheck,
                    description: 'Quản lý tài khoản người dùng và phân quyền'
                },
            ]
        },
        {
            name: 'Cài đặt',
            href: '/settings',
            icon: Settings,
            description: 'Cấu hình hệ thống và tài khoản'
        },
    ]

    async function handleSignOut() {
        try {
            // Call logout API
            const { apiClient } = await import('@/lib/api/client')
            await apiClient.logout()
        } catch (error) {
            console.warn('Logout API failed:', error)
        } finally {
            // Clear auth store
            logout()
            router.push('/auth/login')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Shield className="h-8 w-8 text-medical-500" />
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                            Bạch Mai LIS
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1 ml-8">
                        {navigation.map((item) => {
                            const Icon = item.icon

                            if (item.children) {
                                return (
                                    <DropdownMenu key={item.name}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center space-x-2"
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-[800px] p-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                {/* Cột 1: Địa lý & Tổ chức */}
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 px-2">Địa lý & Tổ chức</h4>
                                                    {item.children.slice(0, 3).map((child) => {
                                                        const ChildIcon = child.icon
                                                        return (
                                                            <DropdownMenuItem
                                                                key={child.name}
                                                                onClick={() => router.push(child.href)}
                                                                className="flex flex-col items-start p-3 cursor-pointer rounded-lg hover:bg-gray-50"
                                                            >
                                                                <div className="flex items-center w-full">
                                                                    <ChildIcon className="mr-2 h-4 w-4 text-medical-600" />
                                                                    <span className="font-medium text-sm">{child.name}</span>
                                                                </div>
                                                                {child.description && (
                                                                    <span className="text-xs text-muted-foreground mt-1 ml-6">
                                                                        {child.description}
                                                                    </span>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )
                                                    })}
                                                </div>

                                                {/* Cột 2: Y tế & Nhân sự */}
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 px-2">Y tế & Nhân sự</h4>
                                                    {item.children.slice(3, 6).map((child) => {
                                                        const ChildIcon = child.icon
                                                        return (
                                                            <DropdownMenuItem
                                                                key={child.name}
                                                                onClick={() => router.push(child.href)}
                                                                className="flex flex-col items-start p-3 cursor-pointer rounded-lg hover:bg-gray-50"
                                                            >
                                                                <div className="flex items-center w-full">
                                                                    <ChildIcon className="mr-2 h-4 w-4 text-medical-600" />
                                                                    <span className="font-medium text-sm">{child.name}</span>
                                                                </div>
                                                                {child.description && (
                                                                    <span className="text-xs text-muted-foreground mt-1 ml-6">
                                                                        {child.description}
                                                                    </span>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )
                                                    })}
                                                </div>

                                                {/* Cột 3: Dịch vụ & Mẫu */}
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 px-2">Dịch vụ & Mẫu</h4>
                                                    {item.children.slice(6).map((child) => {
                                                        const ChildIcon = child.icon
                                                        return (
                                                            <DropdownMenuItem
                                                                key={child.name}
                                                                onClick={() => router.push(child.href)}
                                                                className="flex flex-col items-start p-3 cursor-pointer rounded-lg hover:bg-gray-50"
                                                            >
                                                                <div className="flex items-center w-full">
                                                                    <ChildIcon className="mr-2 h-4 w-4 text-medical-600" />
                                                                    <span className="font-medium text-sm">{child.name}</span>
                                                                </div>
                                                                {child.description && (
                                                                    <span className="text-xs text-muted-foreground mt-1 ml-6">
                                                                        {child.description}
                                                                    </span>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }

                            return (
                                <Button
                                    key={item.name}
                                    variant="ghost"
                                    className="flex items-center space-x-2"
                                    onClick={() => router.push(item.href)}
                                    title={item.description}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Button>
                            )
                        })}
                    </nav>

                    {/* Spacer to push user menu to the right */}
                    <div className="flex-1" />

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.username}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            Role: Admin
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div className={cn(
                'fixed inset-0 z-50 md:hidden',
                sidebarOpen ? 'block' : 'hidden'
            )}>
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75"
                    onClick={() => setSidebarOpen(false)}
                    onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Đóng menu"
                />
                <div className="fixed inset-x-0 top-0 bg-white shadow-lg">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-medical-500" />
                            <span className="ml-2 text-lg font-semibold text-gray-900">
                                Bạch Mai LIS
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="border-t border-gray-200 px-4 py-4">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon

                                if (item.children) {
                                    return (
                                        <div key={item.name} className="space-y-1">
                                            <div className="px-3 py-2">
                                                <div className="flex items-center text-sm font-medium text-gray-500">
                                                    <Icon className="mr-3 h-5 w-5" />
                                                    {item.name}
                                                </div>
                                                {item.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 ml-8">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            {item.children.map((child) => {
                                                const ChildIcon = child.icon
                                                return (
                                                    <div key={child.name} className="ml-6">
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start p-3 h-auto"
                                                            onClick={() => {
                                                                router.push(child.href)
                                                                setSidebarOpen(false)
                                                            }}
                                                        >
                                                            <div className="flex flex-col items-start w-full">
                                                                <div className="flex items-center w-full">
                                                                    <ChildIcon className="mr-3 h-4 w-4 text-medical-600" />
                                                                    <span className="font-medium">{child.name}</span>
                                                                </div>
                                                                {child.description && (
                                                                    <span className="text-xs text-muted-foreground mt-1 ml-7">
                                                                        {child.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                }

                                return (
                                    <Button
                                        key={item.name}
                                        variant="ghost"
                                        className="w-full justify-start p-3 h-auto"
                                        onClick={() => {
                                            router.push(item.href)
                                            setSidebarOpen(false)
                                        }}
                                    >
                                        <div className="flex flex-col items-start w-full">
                                            <div className="flex items-center w-full">
                                                <Icon className="mr-3 h-5 w-5 text-medical-600" />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            {item.description && (
                                                <span className="text-xs text-muted-foreground mt-1 ml-8">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                    </Button>
                                )
                            })}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
