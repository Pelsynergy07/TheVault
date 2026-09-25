"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, Sun, Moon, ExternalLink, Code2 } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminUnlocked(sessionStorage.getItem("vault_admin_unlocked") === "true")
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    },
    [open, onOpenChange],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command Menu"
      className={cn(
        "fixed inset-0 z-[100]",
        "bg-black/60 backdrop-blur-sm",
      )}
    >
      <div className="fixed top-[15%] sm:top-[20%] left-0 right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-card border border-border shadow-2xl">
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search size={14} className="text-muted-foreground/40 shrink-0" />
            <Command.Input
              placeholder="Search projects, themes, actions..."
              className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Theme" className="text-[10px] font-mono tracking-widest text-muted-foreground/40 px-2 py-1.5">
              <Command.Item
                onSelect={() => { setTheme("dark"); onOpenChange(false) }}
                className="flex items-center gap-3 px-2 py-2.5 text-sm text-foreground cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <Moon size={14} className="text-muted-foreground/40" />
                Dark Mode
              </Command.Item>
              <Command.Item
                onSelect={() => { setTheme("light"); onOpenChange(false) }}
                className="flex items-center gap-3 px-2 py-2.5 text-sm text-foreground cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <Sun size={14} className="text-muted-foreground/40" />
                Light Mode
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigate" className="text-[10px] font-mono tracking-widest text-muted-foreground/40 px-2 py-1.5">
              <Command.Item
                onSelect={() => { router.push("/"); onOpenChange(false) }}
                className="flex items-center gap-3 px-2 py-2.5 text-sm text-foreground cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <ExternalLink size={14} className="text-muted-foreground/40" />
                Home
              </Command.Item>
              {isAdminUnlocked && (
                <Command.Item
                  onSelect={() => { router.push("/admin"); onOpenChange(false) }}
                  className="flex items-center gap-3 px-2 py-2.5 text-sm text-foreground cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <Code2 size={14} className="text-muted-foreground/40" />
                  New Project
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>
        </div>
      </div>
    </Command.Dialog>
  )
}
