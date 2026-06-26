import { authApi } from "@/lib/api"

async function getUser() {
    try {
        const response = await authApi.getMe()
        return response.data
    } catch {
        return null
    }
}

export default async function DashboardPage() {
    const user = await getUser()

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="eyebrow mb-3">
                    <span className="eyebrow-dot" />
                    <span>Dashboard</span>
                </div>
                <h1 className="text-3xl tracking-tighter">
                    Welcome back, <span className="font-display italic">{user?.name?.split(" ")[0] || "there"}</span>.
                </h1>
                <p className="text-foreground-muted mt-2">
                    Here's what's happening with your AI support today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Total conversations", value: "0", change: "Start now" },
                    { label: "Documents uploaded", value: "0", change: "Upload first" },
                    { label: "Messages used", value: "0 / 100", change: "Free plan" },
                ].map((stat) => (
                    <div key={stat.label} className="hairline-card p-6">
                        <div className="text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2">
                            {stat.label}
                        </div>
                        <div className="text-3xl font-display text-foreground tabular-nums">
                            {stat.value}
                        </div>
                        <div className="text-xs text-accent mt-2 font-mono">
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            <div className="hairline-card p-12 text-center">
                <div className="eyebrow justify-center mb-4">
                    <span className="eyebrow-dot" />
                    <span>Get started</span>
                </div>
                <h2 className="text-2xl tracking-tight mb-3">
                    Upload your first <span className="font-display italic">document</span>
                </h2>
                <p className="text-foreground-muted max-w-md mx-auto mb-6">
                    Add your knowledge base — PDFs, docs, or text — and your AI will learn to answer customer questions.
                </p>
                <button className="btn-accent">
                    Upload Document
                </button>
            </div>
        </div>
    )
}