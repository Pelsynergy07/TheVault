"use client"

import { forwardRef, useMemo, type HTMLAttributes } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { ExternalLink, Code2, GripVertical } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types"
import { cn } from "@/lib/utils"

function stripMarkdown(text: string): string {
  return text
    .replace(/^[-*]\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim()
}

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

  const plainDescription = useMemo(() => stripMarkdown(project.description ?? ""), [project.description])

  return (
    <div ref={setNodeRef} style={style} className="group relative h-full min-h-[280px] sm:min-h-[320px]">
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
          <div className="flex items-start justify-between gap-4 mb-4">
            <span
              className={cn(
                "inline-flex px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border backdrop-blur-md",
                statusStyles[project.status] ?? "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
              )}
            >
              {project.status}
            </span>
            <div className="flex gap-2 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
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

          <div className="flex-1 min-h-0">
            <h3 className="text-xl sm:text-2xl font-sans tracking-tight text-white/90 group-hover:text-white transition-all duration-500 mb-2">
              {project.title}
            </h3>
            {plainDescription && (
              <p className="text-base text-white/50 leading-relaxed font-sans line-clamp-3">
                {plainDescription}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 space-y-3">
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-mono tracking-wider text-white/40 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
