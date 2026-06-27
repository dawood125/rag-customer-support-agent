"use client"

import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useUIStore } from "@/store/ui-store"

export function LogoutButton() {
    const router = useRouter()
    const logout = useAuthStore((state) => state.logout)
    const isLoading = useAuthStore((state) => state.isLoading)
    const addToast = useUIStore((state) => state.addToast)

    async function handleLogout() {
        try {
            await logout()

            addToast({
                type: "success",
                title: "Logged out",
                description: "You've been logged out successfully."
            })

            router.push("/login")
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-2 rounded-md transition-colors disabled:opacity-50"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
            )}
            {isLoading ? "Logging out..." : "Logout"}
        </button>
    )
}