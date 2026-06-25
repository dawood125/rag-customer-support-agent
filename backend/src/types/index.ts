export interface RegisterRequestBody {
    companyName: string
    name: string
    email: string
    password: string
}

export interface LoginRequestBody {
    email: string
    password: string
}

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data?: T
    error?: string
}


export interface AuthResponse {
    user: {
        _id: string
        name: string
        email: string
        role: string
        companyId: string
    }
    company: {
        _id: string
        name: string
        plan: string
    }
}


export interface JWTPayload {
    userId: string
    companyId: string
    role: string
}


declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload
        }
    }
}

export {}