"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useUIStore, Toast } from "@/store/ui-store"

const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info
}

const colorMap = {
    success: "text-success",
    error: "text-danger",
    warning: "text-warning",
    info: "text-accent"
}

function ToastItem({ toast }: { toast: Toast }) {
    const removeToast = useUIStore((state) => state.removeToast)
    const Icon = iconMap[toast.type]

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hairline-card p-4 flex items-start gap-3 min-w-[320px] max-w-md"
        >
            <Icon className={`w-5 h-5 ${colorMap[toast.type]} flex-shrink-0 mt-0.5`} strokeWidth={1.5} />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.description && (
                    <p className="text-xs text-foreground-muted mt-1">
                        {toast.description}
                    </p>
                )}
            </div>

            <button
                onClick={() => removeToast(toast.id)}
                className="text-foreground-subtle hover:text-foreground transition-colors"
            >
                <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
        </motion.div>
    )
}

export function ToastContainer() {
    const toasts = useUIStore((state) => state.toasts)

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    )
}