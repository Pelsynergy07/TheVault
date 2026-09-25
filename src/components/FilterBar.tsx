"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const ALL_TAGS = [
  "AI",
  "XR",
  "Design Systems",
  "Chrome Extensions",
  "Agents",
  "Automation",
  "Research",
  "Product",
  "3D",
  "WebGL",
  "Mobile",
]

export function FilterBar({
  activeTags,
  onToggle,
}: {
  activeTags: string[]
  onToggle: (tag: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_TAGS.map((tag, i) => (
        <motion.button
          key={tag}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.03, ease: [0.32, 0.72, 0, 1] }}
          onClick={() => onToggle(tag)}
          className={cn(
            "px-3 py-1.5 text-xs font-mono tracking-wider transition-all duration-300",
            "border",
            activeTags.includes(tag)
              ? "bg-accent text-accent-foreground border-accent"
              : "text-muted-foreground/50 border-border/40 hover:text-foreground hover:border-border",
          )}
        >
          {tag}
        </motion.button>
      ))}
    </div>
  )
}
