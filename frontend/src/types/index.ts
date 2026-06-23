
export interface User {
    _id: string
    name: string
    email: string
    role: "admin" | "agent" | "customer"
    companyId: string
    isActive: boolean
    createdAt: string
}

export interface Company {
    _id: string
    name: string
    email: string
    plan: "free" | "basic" | "premium"
    isActive: boolean
    createdAt: string
}


export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    companyName: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
}