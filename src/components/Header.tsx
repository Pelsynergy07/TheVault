"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const isProjectPage = pathname.startsWith("/projects/")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Ensure "Add to Vault" is hidden on every page refresh/load
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("vault_admin_unlocked")
    }

    const handleUnload = () => {
      sessionStorage.removeItem("vault_admin_unlocked")
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    }
  }, [])

  const handleTitleClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault()
    }

    if (isUnlocked) return

    clickCountRef.current += 1

    if (clickCountRef.current >= 5) {
      setIsUnlocked(true)
      clickCountRef.current = 0
      if (typeof window !== "undefined") {
        sessionStorage.setItem("vault_admin_unlocked", "true")
      }
      return
    }

    // Reset count if user stops clicking for more than 2.5 seconds
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, 2500)
  }

  if (isProjectPage) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm border-b border-border/10" />
      <div className="relative mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        <Link
          href="/"
          onClick={handleTitleClick}
          className="text-lg font-medium tracking-tight text-foreground hover:text-foreground/70 transition-colors duration-300 font-sans select-none cursor-pointer touch-manipulation"
        >
          The Vault
        </Link>

        {isUnlocked && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider",
              "border border-border/40 text-foreground/60 hover:text-accent hover:border-accent/30",
              "transition-all duration-300 animate-in fade-in zoom-in-95",
            )}
          >
            <Plus size={14} />
            Add to Vault
          </Link>
        )}
      </div>
    </header>
  )
}
