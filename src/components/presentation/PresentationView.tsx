"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, X, Presentation, Globe, Code2 } from "lucide-react"
import { SlideRenderer } from "./SlideRenderer"
import type { Project } from "@/types"

export function PresentationView({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [interviewMode, setInterviewMode] = useState(false)

  const totalSlides = project.slides.length

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1)
      setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)))
    },
    [currentSlide, totalSlides],
  )

  const next = useCallback(() => {
    if (currentSlide < totalSlides - 1) goTo(currentSlide + 1)
  }, [currentSlide, totalSlides, goTo])

  const prev = useCallback(() => {
    if (currentSlide > 0) goTo(currentSlide - 1)
  }, [currentSlide, goTo])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        next()
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        prev()
      }
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [next, prev, onClose])

  const slide = project.slides[currentSlide]
  if (!slide) return null

  const progress = ((currentSlide + 1) / totalSlides) * 100

  return (
    <div className="fixed inset-0 z-[90] bg-background flex flex-col">
      <header className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-sm font-medium text-foreground truncate max-w-[140px] sm:max-w-none">{project.title}</span>
          <span className="text-xs font-mono text-muted-foreground/50 shrink-0">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground/50 border border-border/40 hover:text-foreground hover:border-border transition-all duration-300"
            >
              <Globe size={11} />
              Live Demo
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground/50 border border-border/40 hover:text-foreground hover:border-border transition-all duration-300"
            >
              <Code2 size={11} />
              GitHub
            </a>
          )}
          <button
            onClick={() => setInterviewMode(!interviewMode)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-mono transition-all duration-300 border ${
              interviewMode
                ? "bg-accent text-accent-foreground border-accent"
                : "text-muted-foreground/50 border-border/40 hover:text-foreground"
            }`}
          >
            <Presentation size={12} />
            Interview Mode
          </button>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground/50 hover:text-foreground transition-colors"
            aria-label="Close presentation"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <SlideRenderer key={slide.id} slide={slide} direction={direction} />
        </AnimatePresence>

        {interviewMode && (
          <div className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-auto px-6 py-3 bg-card border border-border/50 backdrop-blur-md max-w-lg text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-accent font-mono text-xs tracking-widest uppercase mr-2">
                Talking Point:
              </span>
              {slide.content.substring(0, 120)}...
            </p>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-border/50">
        <div className="h-0.5 bg-border/30">
          <div
            className="h-full bg-accent/60 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-6 py-3">
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={14} />
            Previous
          </button>
          <button
            onClick={next}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRight size={14} />
          </button>
        </div>
      </footer>
    </div>
  )
}
