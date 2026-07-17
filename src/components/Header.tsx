"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const isProjectPage = pathname.startsWith("/projects/")

  if (isProjectPage) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm border-b border-border/10" />
      <div className="relative mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        <Link
          href="/"
          className="text-lg font-medium tracking-tight text-foreground hover:text-foreground/70 transition-colors duration-300 font-sans"
        >
          The Vault
        </Link>

        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider",
            "border border-border/40 text-foreground/60 hover:text-accent hover:border-accent/30",
            "transition-all duration-300",
          )}
        >
          <Plus size={14} />
          Add to Vault
        </Link>
      </div>
    </header>
  )
}
