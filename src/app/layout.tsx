import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Header } from "@/components/Header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AI Lab — Research & Prototypes",
  description:
    "Personal R&D lab exploring AI, XR, automation, and product experiments. Prototypes, research, and ambitious ideas shipped quickly.",
  openGraph: {
    title: "AI Lab — Research & Prototypes",
    description:
      "Personal R&D lab exploring AI, XR, automation, and product experiments.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        <div id="vault-initial-overlay" className="fixed inset-0 z-[99] bg-[#0a0a0a] pointer-events-none" />
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
