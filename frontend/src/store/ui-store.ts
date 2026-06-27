import { create } from "zustand"
export interface Toast {
    id: string
    title: string
    description?: string
    type: "success" | "error" | "warning" | "info"
    duration?: number
}

interface UIState {
    sidebarOpen: boolean
    toggleSidebar: () => void
    setSidebar: (open: boolean) => void

    toasts: Toast[]
    addToast: (toast: Omit<Toast, "id">) => void
    removeToast: (id: string) => void

    modal: {
        isOpen: boolean
        type: string | null
        data: any
    }
    openModal: (type: string, data?: any) => void
    closeModal: () => void
}


export const useUIStore = create<UIState>((set, get) => ({

    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebar: (open) => set({ sidebarOpen: open }),


    toasts: [],

    addToast: (toast) => {
        const id = Math.random().toString(36).substring(7)
        const newToast = { ...toast, id }

        set((state) => ({ toasts: [...state.toasts, newToast] }))

        const duration = toast.duration || 4000
        setTimeout(() => {
            get().removeToast(id)
        }, duration)
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }))
    },

    modal: { isOpen: false, type: null, data: null },

    openModal: (type, data = null) => {
        set({ modal: { isOpen: true, type, data } })
    },

    closeModal: () => {
        set({ modal: { isOpen: false, type: null, data: null } })
    }
}))