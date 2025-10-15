const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://192.168.68.209:3333/api/v1'

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
    error?: string
    status?: number
}

export interface LoginRequest {
    usernameOrEmail: string
    password: string
}

export interface LoginResponse {
    user: {
        id: string
        username: string
        email: string
        fullName: string
        role: string
        isActive: number
        lastLoginAt: string
    }
    accessToken: string
    refreshToken: string
    expiresIn: number
}

export interface HisTokenResponse {
    tokenCode: string
    renewCode?: string
    userLoginName: string
    userName: string
    userEmail: string
    userMobile: string
    userGCode: string
    applicationCode: string
    loginTime: string
    expireTime: string
    minutesUntilExpire?: number
    roles?: Array<{
        roleCode?: string
        roleName?: string
        RoleCode?: string
        RoleName?: string
    }>
}

export interface HisDirectLoginResponse {
    message: string
    hisToken: {
        tokenCode: string
        userLoginName: string
        userName: string
        userEmail: string
        userMobile: string
        userGCode: string
        applicationCode: string
        loginTime: string
        expireTime: string
        minutesUntilExpire: number
        roles: Array<{
            roleCode?: string
            roleName?: string
            RoleCode?: string
            RoleName?: string
        }>
    }
    accessToken: string
    tokenType: string
    expiresIn: number
}

export interface HisTokenValidationResponse {
    message: string
    user: {
        loginName: string
        userName: string
        email: string
        mobile: string
        gCode: string
        applicationCode: string
        roles: Array<{
            roleCode: string
            roleName: string
        }>
    }
    token: {
        tokenCode: string
        loginTime: string
        expireTime: string
        minutesUntilExpire: number
        isExpired: boolean
        isExpiringSoon: boolean
    }
}

export interface HisUserInfo {
    loginName: string
    userName: string
    email: string
    mobile: string
    gCode: string
    applicationCode: string
    roles: Array<{
        roleCode: string
        roleName: string
    }>
    loginTime: string
    expireTime: string
    minutesUntilExpire: number
}

export interface HisTokenStatus {
    isValid: boolean
    isExpired: boolean
    isExpiringSoon: boolean
    minutesUntilExpire: number
    userLoginName: string
    userName: string
    loginTime: string
    expireTime: string
}

export interface HisApiCallRequest {
    endpoint: string
    method?: string
    data?: Record<string, unknown>
    username?: string
}

export interface Category {
    id: string
    name: string
    description?: string
    code: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CategoryRequest {
    name: string
    description?: string
    code: string
    isActive?: boolean
}

export interface Province {
    id: string
    provinceCode: string
    provinceName: string
    shortName: string | null
    isActive: number
    createdAt: string
    updatedAt: string
}

export interface ProvinceRequest {
    provinceCode: string
    provinceName: string
    shortName?: string
    isActive?: boolean
}

export interface ProvinceFilters {
    search?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface Ward {
    id: string
    wardCode: string
    wardName: string
    shortName: string | null
    provinceId: string
    isActive: number
    createdAt: string
    updatedAt: string
    province?: Province
}

export interface WardRequest {
    wardCode: string
    wardName: string
    shortName?: string
    provinceId: string
    isActive?: boolean
}

export interface WardFilters {
    search?: string
    provinceId?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface User {
    id: string
    username: string
    email: string
    fullName: string
    phoneNumber?: string
    dateOfBirth?: string
    address?: string
    role: string
    isActiveFlag: number
    lastLoginAt?: string
    hisUsername?: string
    hisPassword?: string
    provinceId?: string
    wardId?: string
    departmentId?: string
    createdAt: string
    updatedAt: string
    province?: Province
    ward?: Ward
    department?: Department
}

export interface UserRequest {
    username: string
    email: string
    fullName: string
    phoneNumber?: string
    dateOfBirth?: string
    address?: string
    role: string
    isActive?: boolean
    hisUsername?: string
    hisPassword?: string
    provinceId?: string
    wardId?: string
    departmentId?: string
}

export interface UserFilters {
    search?: string
    role?: string
    isActive?: boolean
    provinceId?: string
    wardId?: string
    departmentId?: string
    limit?: number
    offset?: number
}

export interface DepartmentType {
    id: string
    typeCode: string
    typeName: string
    description?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
}

export interface DepartmentTypeRequest {
    typeCode: string
    typeName: string
    description?: string
    isActive?: boolean
}

export interface DepartmentTypeFilters {
    search?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface Department {
    id: string
    departmentCode: string
    departmentName: string
    branchId: string
    headOfDepartment?: string
    headNurse?: string
    parentDepartmentId?: string
    shortName?: string
    departmentTypeId?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
    branch?: Branch
    departmentType?: DepartmentType
    parentDepartment?: Department
    subDepartments?: Department[]
}

export interface DepartmentRequest {
    departmentCode: string
    departmentName: string
    branchId: string
    headOfDepartment?: string
    headNurse?: string
    parentDepartmentId?: string
    shortName?: string
    departmentTypeId?: string
    isActive?: boolean
}

export interface DepartmentFilters {
    search?: string
    branchId?: string
    departmentTypeId?: string
    parentDepartmentId?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface ServiceGroup {
    id: string
    serviceGroupCode: string
    serviceGroupName: string
    shortName?: string
    mapping?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
}

export interface ServiceGroupRequest {
    serviceGroupCode: string
    serviceGroupName: string
    shortName?: string
    mapping?: string
    isActive?: boolean
}

export interface ServiceGroupFilters {
    search?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface UnitOfMeasure {
    id: string
    unitOfMeasureCode: string
    unitOfMeasureName: string
    description?: string
    mapping?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
}

export interface UnitOfMeasureRequest {
    unitOfMeasureCode: string
    unitOfMeasureName: string
    description?: string
    mapping?: string
    isActive?: boolean
}

export interface UnitOfMeasureFilters {
    search?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface Service {
    id: string
    serviceCode: string
    serviceName: string
    shortName?: string
    serviceGroupId?: string
    unitOfMeasureId?: string
    mapping?: string
    numOrder?: number
    currentPrice?: number
    parentServiceId?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
    serviceGroup?: ServiceGroup
    unitOfMeasure?: UnitOfMeasure
    parentService?: Service
    subServices?: Service[]
}

export interface ServiceRequest {
    serviceCode: string
    serviceName: string
    shortName?: string
    serviceGroupId?: string
    unitOfMeasureId?: string
    mapping?: string
    numOrder?: number
    currentPrice?: number
    parentServiceId?: string
    isActive?: boolean
}

export interface ServiceFilters {
    search?: string
    serviceGroupId?: string
    unitOfMeasureId?: string
    parentServiceId?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface Room {
    id: string
    roomCode: string
    roomName: string
    roomAddress?: string
    departmentId: string
    description?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
    department?: Department
}

export interface RoomRequest {
    roomCode: string
    roomName: string
    roomAddress?: string
    departmentId: string
    description?: string
    isActive?: boolean
}

export interface RoomFilters {
    search?: string
    departmentId?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface SampleType {
    id: string
    typeCode: string
    typeName: string
    shortName?: string
    codeGenerationRule?: string
    description?: string
    isActiveFlag: number
    createdAt: string
    updatedAt: string
}

export interface SampleTypeRequest {
    typeCode: string
    typeName: string
    shortName?: string
    codeGenerationRule?: string
    description?: string
    isActive?: boolean
}

export interface SampleTypeFilters {
    search?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface Branch {
    id: string
    branchCode: string
    branchName: string
    shortName?: string
    provinceId: string
    wardId: string
    address: string
    phoneNumber?: string
    hospitalLevel?: string
    representative?: string
    bhytCode?: string
    isActive: number
    createdAt: string
    updatedAt: string
    province?: Province
    ward?: Ward
}

export interface BranchRequest {
    branchCode: string
    branchName: string
    shortName?: string
    provinceId: string
    wardId: string
    address: string
    phoneNumber?: string
    hospitalLevel?: string
    representative?: string
    bhytCode?: string
}

export interface BranchFilters {
    search?: string
    provinceId?: string
    wardId?: string
    hospitalLevel?: string
    isActive?: boolean
    limit?: number
    offset?: number
}

class ApiClient {
    private baseURL: string
    private token: string | null = null

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL
        // Get token from auth store if available
        if (typeof window !== 'undefined') {
            this.loadTokenFromStorage()
        }
    }

    private loadTokenFromStorage() {
        try {
            const authData = localStorage.getItem('auth-storage')
            if (authData) {
                const parsed = JSON.parse(authData)
                this.token = parsed.state?.token || null
            }
        } catch (error) {
            console.warn('Failed to parse auth storage:', error)
        }
    }

    setToken(token: string | null) {
        this.token = token
    }

    getToken(): string | null {
        return this.token
    }

    refreshTokenFromStorage() {
        this.loadTokenFromStorage()
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        }

        // Refresh token from storage before making request
        this.refreshTokenFromStorage()

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`
        }

        try {
            console.log('API Request:', {
                url,
                method: options.method || 'GET',
                headers: { ...headers, Authorization: this.token ? 'Bearer ***' : 'None' },
                body: options.body
            })

            const response = await fetch(url, {
                ...options,
                headers,
            })

            let data: unknown
            const contentType = response.headers.get('content-type')

            if (contentType && contentType.includes('application/json')) {
                data = await response.json()
            } else {
                data = { message: await response.text() }
            }

            console.log('API Response:', {
                status: response.status,
                statusText: response.statusText,
                data,
                dataType: typeof data,
                dataKeys: data ? Object.keys(data) : 'null'
            })

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`

                // Handle complex error structure from backend
                if (data && typeof data === 'object' && 'error' in data &&
                    data.error && typeof data.error === 'object' && 'message' in data.error) {
                    errorMessage = String(data.error.message)
                } else if (data && typeof data === 'object' && 'message' in data) {
                    errorMessage = String(data.message)
                } else if (data && typeof data === 'object' && 'error' in data) {
                    errorMessage = String(data.error)
                }

                console.error('API Error:', errorMessage)
                console.error('API Error Data:', data)
                return {
                    success: false,
                    error: errorMessage,
                    status: response.status,
                    data: data as T
                }
            }

            return {
                success: true,
                data: (data && typeof data === 'object' && 'data' in data) ? data.data as T : data as T,
                message: (data && typeof data === 'object' && 'message' in data) ? String(data.message) : undefined
            }
        } catch (error) {
            console.error('API request failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            }
        }
    }

    // Authentication methods
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })

        if (response.success && response.data?.accessToken) {
            this.setToken(response.data.accessToken)
        }

        return response
    }

    async logout(): Promise<ApiResponse> {
        const response = await this.request('/auth/logout', {
            method: 'POST',
        })

        this.setToken(null)
        return response
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        })
    }

    async getProfile(): Promise<ApiResponse<LoginResponse['user']>> {
        return this.request<LoginResponse['user']>('/auth/profile')
    }

    // Category management methods
    async getCategories(): Promise<ApiResponse<Category[]>> {
        return this.request<Category[]>('/categories')
    }

    async getCategory(id: string): Promise<ApiResponse<Category>> {
        return this.request<Category>(`/categories/${id}`)
    }

    async createCategory(category: CategoryRequest): Promise<ApiResponse<Category>> {
        return this.request<Category>('/categories', {
            method: 'POST',
            body: JSON.stringify(category),
        })
    }

    async updateCategory(id: string, category: Partial<CategoryRequest>): Promise<ApiResponse<Category>> {
        return this.request<Category>(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(category),
        })
    }

    async deleteCategory(id: string): Promise<ApiResponse> {
        return this.request(`/categories/${id}`, {
            method: 'DELETE',
        })
    }

    // Branch management methods
    async getBranches(filters?: BranchFilters): Promise<ApiResponse<{ items: Branch[]; pagination: { limit: number; offset: number; total: number; has_next: boolean; has_prev: boolean } }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: Branch[]; pagination: { limit: number; offset: number; total: number; has_next: boolean; has_prev: boolean } }>(`/branches${queryString ? `?${queryString}` : ''}`)
    }

    async getBranch(id: string): Promise<ApiResponse<Branch>> {
        return this.request<Branch>(`/branches/${id}`)
    }

    async createBranch(branch: BranchRequest): Promise<ApiResponse<Branch>> {
        return this.request<Branch>('/branches', {
            method: 'POST',
            body: JSON.stringify(branch),
        })
    }

    async updateBranch(id: string, branch: Partial<BranchRequest>): Promise<ApiResponse<Branch>> {
        return this.request<Branch>(`/branches/${id}`, {
            method: 'PUT',
            body: JSON.stringify(branch),
        })
    }

    async deleteBranch(id: string): Promise<ApiResponse> {
        return this.request(`/branches/${id}`, {
            method: 'DELETE',
        })
    }

    async getBranchesByProvince(provinceId: string, limit = 10, offset = 0): Promise<ApiResponse<{ items: Branch[]; total: number; limit: number; offset: number }>> {
        return this.request<{ items: Branch[]; total: number; limit: number; offset: number }>(`/provinces/${provinceId}/branches?limit=${limit}&offset=${offset}`)
    }

    // Province management methods
    async getProvinces(filters?: ProvinceFilters): Promise<ApiResponse<{ items: Province[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: Province[]; total: number; limit: number; offset: number }>(`/provinces${queryString ? `?${queryString}` : ''}`)
    }

    async getProvince(id: string): Promise<ApiResponse<Province>> {
        return this.request<Province>(`/provinces/${id}`)
    }

    async createProvince(province: ProvinceRequest): Promise<ApiResponse<Province>> {
        return this.request<Province>('/provinces', {
            method: 'POST',
            body: JSON.stringify(province),
        })
    }

    async updateProvince(id: string, province: Partial<ProvinceRequest>): Promise<ApiResponse<Province>> {
        return this.request<Province>(`/provinces/${id}`, {
            method: 'PUT',
            body: JSON.stringify(province),
        })
    }

    async deleteProvince(id: string): Promise<ApiResponse> {
        return this.request(`/provinces/${id}`, {
            method: 'DELETE',
        })
    }

    // Ward management methods
    async getWards(filters?: WardFilters): Promise<ApiResponse<{ items: Ward[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: Ward[]; total: number; limit: number; offset: number }>(`/wards${queryString ? `?${queryString}` : ''}`)
    }

    async getWard(id: string): Promise<ApiResponse<Ward>> {
        return this.request<Ward>(`/wards/${id}`)
    }

    async getWardsByProvince(provinceId: string, limit = 10, offset = 0): Promise<ApiResponse<{ items: Ward[]; total: number; limit: number; offset: number }>> {
        return this.request<{ items: Ward[]; total: number; limit: number; offset: number }>(`/wards/province/${provinceId}?limit=${limit}&offset=${offset}`)
    }

    async createWard(ward: WardRequest): Promise<ApiResponse<Ward>> {
        return this.request<Ward>('/wards', {
            method: 'POST',
            body: JSON.stringify(ward),
        })
    }

    async updateWard(id: string, ward: Partial<WardRequest>): Promise<ApiResponse<Ward>> {
        return this.request<Ward>(`/wards/${id}`, {
            method: 'PUT',
            body: JSON.stringify(ward),
        })
    }

    async deleteWard(id: string): Promise<ApiResponse> {
        return this.request(`/wards/${id}`, {
            method: 'DELETE',
        })
    }

    // HIS Integration methods
    async hisLogin(): Promise<ApiResponse<HisTokenResponse>> {
        return this.request<HisTokenResponse>('/his-integration/login', {
            method: 'POST',
        })
    }

    async hisLoginWithCredentials(credentials: { username: string; password: string }): Promise<ApiResponse<HisDirectLoginResponse>> {
        return this.request<HisDirectLoginResponse>('/his-direct-login/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    }

    async validateHisToken(token: string): Promise<ApiResponse<HisTokenValidationResponse>> {
        return this.request<HisTokenValidationResponse>('/his-direct-login/validate-token', {
            method: 'POST',
            body: JSON.stringify({ token }),
        })
    }

    async hisRenewToken(renewCode: string): Promise<ApiResponse<HisTokenResponse>> {
        return this.request<HisTokenResponse>('/his-integration/renew-token', {
            method: 'POST',
            body: JSON.stringify({ renewCode }),
        })
    }

    async getHisToken(username?: string): Promise<ApiResponse<HisTokenResponse>> {
        const endpoint = username
            ? `/his-integration/token?username=${username}`
            : '/his-integration/token'
        return this.request<HisTokenResponse>(endpoint)
    }

    async refreshHisToken(username?: string): Promise<ApiResponse<HisTokenResponse>> {
        const endpoint = username
            ? `/his-integration/refresh-token?username=${username}`
            : '/his-integration/refresh-token'
        return this.request<HisTokenResponse>(endpoint, {
            method: 'POST',
        })
    }

    async callHisApi(request: HisApiCallRequest): Promise<ApiResponse> {
        return this.request('/his-integration/call-api', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }

    async getHisUserInfo(username: string): Promise<ApiResponse<HisUserInfo>> {
        return this.request<HisUserInfo>(`/his-integration/user-info/${username}`)
    }

    async hisLogout(username: string): Promise<ApiResponse> {
        return this.request(`/his-integration/logout/${username}`, {
            method: 'POST',
        })
    }

    async getHisTokenStatus(username?: string): Promise<ApiResponse<HisTokenStatus>> {
        const endpoint = username
            ? `/his-integration/token-status?username=${username}`
            : '/his-integration/token-status'
        return this.request<HisTokenStatus>(endpoint)
    }

    async cleanupExpiredHisTokens(): Promise<ApiResponse> {
        return this.request('/his-integration/cleanup-expired-tokens', {
            method: 'POST',
        })
    }

    // User management methods
    async getUsers(filters?: UserFilters): Promise<ApiResponse<{ items: User[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: User[]; total: number; limit: number; offset: number }>(`/users${queryString ? `?${queryString}` : ''}`)
    }

    async getUser(id: string): Promise<ApiResponse<User>> {
        return this.request<User>(`/users/${id}`)
    }

    async createUser(user: UserRequest): Promise<ApiResponse<User>> {
        return this.request<User>('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        })
    }

    async updateUser(id: string, user: Partial<UserRequest>): Promise<ApiResponse<User>> {
        return this.request<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        })
    }

    async deleteUser(id: string): Promise<ApiResponse> {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        })
    }

    // Department Type management methods
    async getDepartmentTypes(filters?: DepartmentTypeFilters): Promise<ApiResponse<{ items: DepartmentType[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: DepartmentType[]; total: number; limit: number; offset: number }>(`/department-types${queryString ? `?${queryString}` : ''}`)
    }

    async getDepartmentType(id: string): Promise<ApiResponse<DepartmentType>> {
        return this.request<DepartmentType>(`/department-types/${id}`)
    }

    async createDepartmentType(departmentType: DepartmentTypeRequest): Promise<ApiResponse<DepartmentType>> {
        return this.request<DepartmentType>('/department-types', {
            method: 'POST',
            body: JSON.stringify(departmentType),
        })
    }

    async updateDepartmentType(id: string, departmentType: Partial<DepartmentTypeRequest>): Promise<ApiResponse<DepartmentType>> {
        return this.request<DepartmentType>(`/department-types/${id}`, {
            method: 'PUT',
            body: JSON.stringify(departmentType),
        })
    }

    async deleteDepartmentType(id: string): Promise<ApiResponse> {
        return this.request(`/department-types/${id}`, {
            method: 'DELETE',
        })
    }

    // Department management methods
    async getDepartments(filters?: DepartmentFilters): Promise<ApiResponse<{ items: Department[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: Department[]; total: number; limit: number; offset: number }>(`/departments${queryString ? `?${queryString}` : ''}`)
    }

    async getDepartment(id: string): Promise<ApiResponse<Department>> {
        return this.request<Department>(`/departments/${id}`)
    }

    async createDepartment(department: DepartmentRequest): Promise<ApiResponse<Department>> {
        return this.request<Department>('/departments', {
            method: 'POST',
            body: JSON.stringify(department),
        })
    }

    async updateDepartment(id: string, department: Partial<DepartmentRequest>): Promise<ApiResponse<Department>> {
        return this.request<Department>(`/departments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(department),
        })
    }

    async deleteDepartment(id: string): Promise<ApiResponse> {
        return this.request(`/departments/${id}`, {
            method: 'DELETE',
        })
    }

    async getDepartmentsByBranch(branchId: string, limit = 10, offset = 0): Promise<ApiResponse<{ items: Department[]; total: number; limit: number; offset: number }>> {
        return this.request<{ items: Department[]; total: number; limit: number; offset: number }>(`/branches/${branchId}/departments?limit=${limit}&offset=${offset}`)
    }

    // Service Group management methods
    async getServiceGroups(filters?: ServiceGroupFilters): Promise<ApiResponse<{ items: ServiceGroup[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: ServiceGroup[]; total: number; limit: number; offset: number }>(`/service-groups${queryString ? `?${queryString}` : ''}`)
    }

    async getServiceGroup(id: string): Promise<ApiResponse<ServiceGroup>> {
        return this.request<ServiceGroup>(`/service-groups/${id}`)
    }

    async createServiceGroup(serviceGroup: ServiceGroupRequest): Promise<ApiResponse<ServiceGroup>> {
        return this.request<ServiceGroup>('/service-groups', {
            method: 'POST',
            body: JSON.stringify(serviceGroup),
        })
    }

    async updateServiceGroup(id: string, serviceGroup: Partial<ServiceGroupRequest>): Promise<ApiResponse<ServiceGroup>> {
        return this.request<ServiceGroup>(`/service-groups/${id}`, {
            method: 'PUT',
            body: JSON.stringify(serviceGroup),
        })
    }

    async deleteServiceGroup(id: string): Promise<ApiResponse> {
        return this.request(`/service-groups/${id}`, {
            method: 'DELETE',
        })
    }

    // Unit of Measure management methods
    async getUnitOfMeasures(filters?: UnitOfMeasureFilters): Promise<ApiResponse<{ items: UnitOfMeasure[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: UnitOfMeasure[]; total: number; limit: number; offset: number }>(`/unit-of-measures${queryString ? `?${queryString}` : ''}`)
    }

    async getUnitOfMeasure(id: string): Promise<ApiResponse<UnitOfMeasure>> {
        return this.request<UnitOfMeasure>(`/unit-of-measures/${id}`)
    }

    async createUnitOfMeasure(unitOfMeasure: UnitOfMeasureRequest): Promise<ApiResponse<UnitOfMeasure>> {
        return this.request<UnitOfMeasure>('/unit-of-measures', {
            method: 'POST',
            body: JSON.stringify(unitOfMeasure),
        })
    }

    async updateUnitOfMeasure(id: string, unitOfMeasure: Partial<UnitOfMeasureRequest>): Promise<ApiResponse<UnitOfMeasure>> {
        return this.request<UnitOfMeasure>(`/unit-of-measures/${id}`, {
            method: 'PUT',
            body: JSON.stringify(unitOfMeasure),
        })
    }

    async deleteUnitOfMeasure(id: string): Promise<ApiResponse> {
        return this.request(`/unit-of-measures/${id}`, {
            method: 'DELETE',
        })
    }

    // Service management methods
    async getServices(filters?: ServiceFilters): Promise<ApiResponse<{ items: Service[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: Service[]; total: number; limit: number; offset: number }>(`/services${queryString ? `?${queryString}` : ''}`)
    }

    async getService(id: string): Promise<ApiResponse<Service>> {
        return this.request<Service>(`/services/${id}`)
    }

    async createService(service: ServiceRequest): Promise<ApiResponse<Service>> {
        return this.request<Service>('/services', {
            method: 'POST',
            body: JSON.stringify(service),
        })
    }

    async updateService(id: string, service: Partial<ServiceRequest>): Promise<ApiResponse<Service>> {
        return this.request<Service>(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(service),
        })
    }

    async deleteService(id: string): Promise<ApiResponse> {
        return this.request(`/services/${id}`, {
            method: 'DELETE',
        })
    }

    async getServicesByGroup(serviceGroupId: string, limit = 10, offset = 0): Promise<ApiResponse<{ items: Service[]; total: number; limit: number; offset: number }>> {
        return this.request<{ items: Service[]; total: number; limit: number; offset: number }>(`/service-groups/${serviceGroupId}/services?limit=${limit}&offset=${offset}`)
    }

    // Room management methods
    async getRooms(filters?: RoomFilters): Promise<ApiResponse<{ items: Room[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: Room[]; total: number; limit: number; offset: number }>(`/rooms${queryString ? `?${queryString}` : ''}`)
    }

    async getRoom(id: string): Promise<ApiResponse<Room>> {
        return this.request<Room>(`/rooms/${id}`)
    }

    async createRoom(room: RoomRequest): Promise<ApiResponse<Room>> {
        return this.request<Room>('/rooms', {
            method: 'POST',
            body: JSON.stringify(room),
        })
    }

    async updateRoom(id: string, room: Partial<RoomRequest>): Promise<ApiResponse<Room>> {
        return this.request<Room>(`/rooms/${id}`, {
            method: 'PUT',
            body: JSON.stringify(room),
        })
    }

    async deleteRoom(id: string): Promise<ApiResponse> {
        return this.request(`/rooms/${id}`, {
            method: 'DELETE',
        })
    }

    async getRoomsByDepartment(departmentId: string, limit = 10, offset = 0): Promise<ApiResponse<{ items: Room[]; total: number; limit: number; offset: number }>> {
        return this.request<{ items: Room[]; total: number; limit: number; offset: number }>(`/departments/${departmentId}/rooms?limit=${limit}&offset=${offset}`)
    }

    // Sample Type management methods
    async getSampleTypes(filters?: SampleTypeFilters): Promise<ApiResponse<{ items: SampleType[]; total: number; limit: number; offset: number }>> {
        const params = new URLSearchParams()
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString())
                }
            })
        }
        const queryString = params.toString()
        return this.request<{ items: SampleType[]; total: number; limit: number; offset: number }>(`/sample-types${queryString ? `?${queryString}` : ''}`)
    }

    async getSampleType(id: string): Promise<ApiResponse<SampleType>> {
        return this.request<SampleType>(`/sample-types/${id}`)
    }

    async createSampleType(sampleType: SampleTypeRequest): Promise<ApiResponse<SampleType>> {
        return this.request<SampleType>('/sample-types', {
            method: 'POST',
            body: JSON.stringify(sampleType),
        })
    }

    async updateSampleType(id: string, sampleType: Partial<SampleTypeRequest>): Promise<ApiResponse<SampleType>> {
        return this.request<SampleType>(`/sample-types/${id}`, {
            method: 'PUT',
            body: JSON.stringify(sampleType),
        })
    }

    async deleteSampleType(id: string): Promise<ApiResponse> {
        return this.request(`/sample-types/${id}`, {
            method: 'DELETE',
        })
    }
}

export const apiClient = new ApiClient()
