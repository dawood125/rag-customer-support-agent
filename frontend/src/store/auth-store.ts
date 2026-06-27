import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "@/lib/api"

interface User {
    _id: string
    name: string
    email: string
    role: string
    companyId: string
}

interface Company {
    _id: string
    name: string
    plan: string
}

interface AuthState {
    // State
    user: User | null
    company: Company | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    login: (email: string, password: string) => Promise<void>
    register: (data: {
        companyName: string
        name: string
        email: string
        password: string
    }) => Promise<void>
    logout: () => Promise<void>
    setUser: (user: User, company: Company) => void
    clearAuth: () => void
}


export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            company: null,
            isAuthenticated: false,
            isLoading: false,

        
            login: async (email, password) => {
                set({ isLoading: true })

                try {
                    const response = await authApi.login({ email, password })

                    set({
                        user: response.data.user,
                        company: response.data.company,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    set({ isLoading: false })
                    throw error  // Component ko error milega
                }
            },

            register: async (data) => {
                set({ isLoading: true })

                try {
                    const response = await authApi.register(data)

                    set({
                        user: response.data.user,
                        company: response.data.company,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },


            logout: async () => {
                try {
                    await authApi.logout()
                } catch (error) {
                    console.error("Logout API failed:", error)
                } finally {
                    set({
                        user: null,
                        company: null,
                        isAuthenticated: false
                    })
                }
            },


            setUser: (user, company) => {
                set({ user, company, isAuthenticated: true })
            },

            clearAuth: () => {
                set({
                    user: null,
                    company: null,
                    isAuthenticated: false
                })
            }
        }),
        {


            name: "neuraldesk-auth", 

            partialize: (state) => ({
                user: state.user,
                company: state.company,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)