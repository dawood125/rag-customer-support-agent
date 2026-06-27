import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "../styles/globals.css"
import { ToastContainer } from "@/components/ui/toast-container"

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
})

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-serif",
    display: "swap",
})

export const metadata: Metadata = {
    title: "NeuralDesk — AI Customer Support",
    description: "AI-powered customer support that actually knows your product.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" data-scroll-behavior="smooth">
            <body
                className={`
                    ${geist.variable}
                    ${geistMono.variable}
                    ${instrumentSerif.variable}
                    antialiased
                    bg-background
                `}
            >
                <div className="grain" />
                {children}
                <ToastContainer />
            </body>
        </html>
    )
}