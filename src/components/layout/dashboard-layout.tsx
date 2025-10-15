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
    TestTube,
    Wrench
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
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        {
            name: 'Quản lý danh mục',
            icon: Users,
            children: [
                { name: 'Danh mục', href: '/categories', icon: Users },
                { name: 'Chi nhánh', href: '/branches', icon: Building2 },
            ]
        },
        {
            name: 'Quản lý địa điểm',
            icon: MapPin,
            children: [
                { name: 'Tỉnh/Thành phố', href: '/provinces', icon: MapPin },
                { name: 'Phường/Xã', href: '/wards', icon: Home },
            ]
        },
        {
            name: 'Quản lý nhân sự',
            icon: UserCheck,
            children: [
                { name: 'Người dùng', href: '/users', icon: UserCheck },
                { name: 'Loại khoa', href: '/department-types', icon: Building },
                { name: 'Khoa', href: '/departments', icon: Building2 },
            ]
        },
        {
            name: 'Quản lý dịch vụ',
            icon: Stethoscope,
            children: [
                { name: 'Nhóm dịch vụ', href: '/service-groups', icon: Package },
                { name: 'Đơn vị tính', href: '/unit-of-measures', icon: Ruler },
                { name: 'Dịch vụ', href: '/services', icon: Stethoscope },
            ]
        },
        {
            name: 'Quản lý cơ sở hạ tầng',
            icon: Wrench,
            children: [
                { name: 'Phòng', href: '/rooms', icon: Home },
                { name: 'Loại mẫu', href: '/sample-types', icon: TestTube },
            ]
        },
        { name: 'Cài đặt', href: '/settings', icon: Settings },
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
                                        <DropdownMenuContent align="start">
                                            {item.children.map((child) => {
                                                const ChildIcon = child.icon
                                                return (
                                                    <DropdownMenuItem
                                                        key={child.name}
                                                        onClick={() => router.push(child.href)}
                                                    >
                                                        <ChildIcon className="mr-2 h-4 w-4" />
                                                        <span>{child.name}</span>
                                                    </DropdownMenuItem>
                                                )
                                            })}
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
                                            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-500">
                                                <Icon className="mr-3 h-5 w-5" />
                                                {item.name}
                                            </div>
                                            {item.children.map((child) => {
                                                const ChildIcon = child.icon
                                                return (
                                                    <Button
                                                        key={child.name}
                                                        variant="ghost"
                                                        className="w-full justify-start ml-6"
                                                        onClick={() => {
                                                            router.push(child.href)
                                                            setSidebarOpen(false)
                                                        }}
                                                    >
                                                        <ChildIcon className="mr-3 h-4 w-4" />
                                                        {child.name}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    )
                                }

                                return (
                                    <Button
                                        key={item.name}
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            router.push(item.href)
                                            setSidebarOpen(false)
                                        }}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
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
