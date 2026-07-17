"use client"

import { forwardRef, type HTMLAttributes } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { ExternalLink, Code2, GripVertical } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  Production: "bg-white/10 text-white border-white/20",
  Live: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Prototype: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Internal: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Hackathon: "bg-rose-500/10 text-rose-400 border-rose-500/20",
}

const DragHandle = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>((props, ref) => (
  <button
    ref={ref}
    {...props}
    className="absolute top-3 left-3 z-20 p-1.5 text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
    aria-label="Drag to reorder"
  >
    <GripVertical size={14} />
  </button>
))
DragHandle.displayName = "DragHandle"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.slug })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative h-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.15 * index, ease: [0.32, 0.72, 0, 1] }}
        className="h-full"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

        <DragHandle {...attributes} {...listeners} />

        <Link
          href={`/projects/${project.slug}`}
          className={cn(
            "relative z-10 flex flex-col h-full p-6 sm:p-8",
            "bg-black/40 backdrop-blur-md",
            "border border-white/10",
            "hover:border-white/30 hover:bg-black/60 transition-all duration-500",
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <span
              className={cn(
                "inline-flex px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border backdrop-blur-md",
                statusStyles[project.status] ?? "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
              )}
            >
              {project.status}
            </span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all"
                  aria-label="Live Demo"
                >
                  <ExternalLink size={16} strokeWidth={2} />
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all"
                  aria-label="GitHub"
                >
                  <Code2 size={16} strokeWidth={2} />
                </a>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-sans tracking-tight text-white/90 group-hover:text-white transition-all duration-500 mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed font-sans line-clamp-3">
              {project.tagline}
            </p>
          </div>

          <div className="mt-8">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-white/80 transition-colors duration-300 flex items-center gap-2">
              View Project
              <span className="block w-4 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-white/80 transition-all duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }} />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
