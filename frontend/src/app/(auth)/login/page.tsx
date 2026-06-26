"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"
import { apiUrl, getErrorMessage } from "@/lib/utils"

import { authApi } from "@/lib/api"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        if (error) setError("")
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields")
            setIsLoading(false)
            return
        }

        try {
            const response = await authApi.login({
                email: formData.email,
                password: formData.password
            })
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Login failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-svh bg-background flex overflow-x-hidden">

            {/* Left - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-sm"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                            <span className="text-background text-xs font-bold">N</span>
                        </div>
                        <span className="font-medium tracking-tight">NeuralDesk</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl tracking-tighter mb-2">
                            Welcome <span className="font-display italic">back</span>.
                        </h1>
                        <p className="text-foreground-muted text-sm">
                            Sign in to your account to continue.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-danger/10 border border-danger/20 rounded-md p-3 mb-6"
                        >
                            <p className="text-danger text-xs">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@company.com"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-accent w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-foreground-muted mt-8">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-accent hover:text-accent-hover">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right - Decorative */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center border-l border-border overflow-hidden">
                <div className="absolute inset-0 gradient-mesh" />
                <div className="relative z-10 max-w-sm px-12">
                    <div className="eyebrow mb-6">
                        <Sparkles className="w-3 h-3 text-accent" strokeWidth={1.5} />
                        <span>Why NeuralDesk</span>
                    </div>
                    <p className="font-display text-3xl leading-snug text-foreground-muted">
                        "The only support AI that{" "}
                        <span className="text-accent italic">actually</span>{" "}
                        reads your docs."
                    </p>
                </div>
            </div>
        </main>
    )
}