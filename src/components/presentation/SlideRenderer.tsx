"use client"

import { motion } from "framer-motion"
import { ExternalLink, Code2 } from "lucide-react"
import { FormattedContent } from "@/components/FormattedContent"
import type { SlideContent } from "@/types"

const slideVariants = {
  enter: { opacity: 0, x: 60, filter: "blur(8px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -60, filter: "blur(8px)" },
}

const slideLabels: Record<string, string> = {
  problem: "The Problem",
  why: "Why It Matters",
  solution: "The Solution",
  architecture: "Architecture",
  results: "Results & Impact",
  learnings: "Learnings",
}

export function SlideRenderer({ slide, direction }: { slide: SlideContent; direction: number }) {
  return (
    <motion.div
      key={slide.id}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col justify-center h-full px-8 sm:px-16 lg:px-24 max-w-5xl mx-auto"
    >
      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-accent/60 mb-6">
        {slideLabels[slide.type] ?? slide.type}
      </span>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
        {slide.title}
      </h2>

      <div className="max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
        <FormattedContent text={slide.content} />
      </div>

      {slide.media && (
        <div className="mt-8 max-w-2xl">
          {slide.media.type === "image" && (
            <img
              src={slide.media.src}
              alt={slide.media.alt ?? ""}
              className="w-full border border-border/50"
            />
          )}
          {slide.media.type === "video" && (
            <video
              src={slide.media.src}
              controls
              className="w-full border border-border/50"
            />
          )}
          {slide.media.type === "diagram" && (
            <img
              src={slide.media.src}
              alt={slide.media.alt ?? "Architecture diagram"}
              className="w-full border border-border/50"
            />
          )}
        </div>
      )}

      {slide.links && slide.links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {slide.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors border border-accent/20 px-4 py-2"
            >
              {link.url.includes("github") ? <Code2 size={14} /> : <ExternalLink size={14} />}
              {link.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  )
}
