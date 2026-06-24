"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, Sparkles, Zap, MessageSquare, FileText } from "lucide-react"

// Dynamic import for 3D - performance ke liye
// Note: in Next.js 16, ssr:false in a client page bails the whole page to CSR
// and breaks framer-motion hydration. R3F handles SSR gracefully (mounts on client).
const KnowledgeSphere = dynamic(
    () => import("../../components/marketing/knowledge-sphere")
)

// Stagger animation helper
const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
}

export default function HomePage() {
    return (
        <main className="min-h-svh bg-background text-foreground relative overflow-x-hidden">

            {/* Background mesh gradient */}
            <div className="absolute inset-0 gradient-mesh" />

            {/* Navbar */}
            <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                        <span className="text-background text-xs font-bold">N</span>
                    </div>
                    <span className="font-medium text-foreground tracking-tight">
                        NeuralDesk
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/login" className="btn-ghost text-sm">
                        Login
                    </Link>
                    <Link href="/register" className="btn-primary text-sm">
                        Get Started
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </motion.nav>

            {/* Hero Section - Asymmetric 60/40 */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-24">
                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">

                    {/* Left - Text Content */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Eyebrow */}
                        <motion.div variants={fadeUp} className="eyebrow mb-6">
                            <span className="eyebrow-dot" />
                            <span>01 — Intelligence</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            className="text-5xl md:text-7xl tracking-tighter text-balance leading-[1.05] mb-6"
                        >
                            Customer support
                            <br />
                            that <span className="font-display text-accent">actually</span> knows
                            <br />
                            your <span className="font-display italic">product</span>.
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={fadeUp}
                            className="text-foreground-muted text-lg max-w-xl leading-relaxed mb-8"
                        >
                            Upload your docs. We build a RAG pipeline that answers
                            your customers on web and WhatsApp — accurately, instantly,
                            in your brand voice.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                            <Link href="/register" className="btn-accent">
                                Start free trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="#how-it-works" className="btn-ghost">
                                See how it works
                            </Link>
                        </motion.div>

                        {/* Mini trust signal */}
                        <motion.div
                            variants={fadeUp}
                            className="mt-10 flex items-center gap-4 text-xs text-foreground-subtle"
                        >
                            <div className="flex -space-x-2">
                                {["#00ADB5", "#4ADE80", "#FBBF24"].map((c, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full border-2 border-background"
                                        style={{ background: c }}
                                    />
                                ))}
                            </div>
                            <span className="font-mono">NO CREDIT CARD • 14-DAY TRIAL</span>
                        </motion.div>
                    </motion.div>

                    {/* Right - 3D Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-[500px] hidden lg:block"
                    >
                        <KnowledgeSphere />
                    </motion.div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="relative z-10 border-y border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-3 gap-8">
                    {[
                        { value: "<1s", label: "Response time" },
                        { value: "94%", label: "Resolution rate" },
                        { value: "24/7", label: "Always on" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <div className="font-display text-4xl md:text-5xl text-accent mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs font-mono text-foreground-subtle uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div className="text-center mb-16">
                    <div className="eyebrow justify-center mb-4">
                        <span className="eyebrow-dot" />
                        <span>02 — How it works</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl tracking-tighter text-balance">
                        Three steps to <span className="font-display italic">infinite</span> support.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: FileText,
                            step: "01",
                            title: "Upload documents",
                            desc: "PDFs, Word, Notion exports, website URLs. We chunk and embed them."
                        },
                        {
                            icon: Zap,
                            step: "02",
                            title: "RAG pipeline builds",
                            desc: "Your knowledge gets vectorized. Smart retrieval finds the right context."
                        },
                        {
                            icon: MessageSquare,
                            step: "03",
                            title: "AI replies instantly",
                            desc: "Customers ask. Your AI answers — on web widget and WhatsApp."
                        }
                    ].map((item) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="hairline-card p-8 hover:bg-surface-2 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <item.icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                                <span className="font-mono text-xs text-foreground-subtle">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-medium mb-2 tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-sm text-foreground-muted leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={1.5} />
                        <span>Built for support teams who care about accuracy</span>
                    </div>
                    <span className="font-mono text-xs text-foreground-subtle shrink-0">
                        © 2025 NeuralDesk
                    </span>
                </div>
            </footer>
        </main>
    )
}