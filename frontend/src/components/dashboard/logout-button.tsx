"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { authApi } from "@/lib/api"

export function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogout() {
        setIsLoading(true)
        try {
            await authApi.logout()
            router.push("/login")
            router.refresh()  
        } catch (err) {
            console.error("Logout failed:", err)
        } finally {
            setIsLoading(false)
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