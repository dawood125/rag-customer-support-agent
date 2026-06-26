import { redirect } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { authApi } from "@/lib/api"
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Users } from "lucide-react"


async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const response = await authApi.getMe({
            headers: {
                Cookie: cookieStore.toString(),
            },
        })
        return response.data
    } catch (error) {
        return null
    }
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="min-h-svh bg-background flex">

            {/* Sidebar */}
            <aside className="w-60 border-r border-border flex flex-col fixed h-screen">
                {/* Logo */}
                <div className="p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                            <span className="text-background text-xs font-bold">N</span>
                        </div>
                        <span className="font-medium tracking-tight">NeuralDesk</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
                        { href: "/dashboard/knowledge", icon: FileText, label: "Knowledge" },
                        { href: "/dashboard/conversations", icon: MessageSquare, label: "Conversations" },
                        { href: "/dashboard/team", icon: Users, label: "Team" },
                        { href: "/dashboard/settings", icon: Settings, label: "Settings" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                        >
                            <item.icon className="w-4 h-4" strokeWidth={1.5} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-accent-subtle border border-accent/30 flex items-center justify-center">
                            <span className="text-xs text-accent font-medium">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-foreground-subtle truncate">
                                {user.role}
                            </p>
                        </div>
                    </div>

                    {/* Logout button */}
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-60">
                {children}
            </main>
        </div>
    )
}


import { LogoutButton } from "../../components/dashboard/logout-button"