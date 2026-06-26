const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"


async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>)
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", 
    })

    const data = await response.json()

    if (!response.ok) {
        throw new ApiError(
            data.message || "Something went wrong",
            response.status,
            data
        )
    }

    return data
}


export class ApiError extends Error {
    status: number
    data: any

    constructor(message: string, status: number, data: any) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.data = data
    }
}


export const authApi = {
    register: (data: {
        companyName: string
        name: string
        email: string
        password: string
    }) => request<{
        success: boolean
        message: string
        data: {
            user: { _id: string; name: string; email: string; role: string; companyId: string }
            company: { _id: string; name: string; plan: string }
        }
    }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    // Login
    login: (data: { email: string; password: string }) =>
        request<{
            success: boolean
            message: string
            data: {
                user: { _id: string; name: string; email: string; role: string; companyId: string }
                company: { _id: string; name: string; plan: string }
            }
        }>("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(data)
        }),

    // Logout
    logout: () =>
        request<{ success: boolean; message: string }>(
            "/api/v1/auth/logout",
            { method: "POST" }
        ),

    // Get current user
    getMe: (options: RequestInit = {}) =>
        request<{ success: boolean; data: any }>("/api/v1/auth/me", options),

    // Refresh token
    refresh: () =>
        request<{ success: boolean; message: string }>(
            "/api/v1/auth/refresh",
            { method: "POST" }
        )
}