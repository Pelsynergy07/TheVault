"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { motion } from "framer-motion"
import type { Project } from "@/types"
import { ProjectCard } from "./ProjectCard"

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects.map((p) => p.slug))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((prev) => {
      const oldIndex = prev.indexOf(active.id as string)
      const newIndex = prev.indexOf(over.id as string)
      const next = [...prev]
      next.splice(oldIndex, 1)
      next.splice(newIndex, 0, active.id as string)
      fetch("/api/projects/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: next }),
      })
      return next
    })
  }, [])

  const sorted = items
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined)

  if (sorted.length === 0) {
    return (
      <div className="text-center py-32 text-muted-foreground/60">
        <p className="text-lg">No projects yet.</p>
      </div>
    )
  }

  return (
    <section className="px-6 w-full max-w-7xl mx-auto z-10 relative pointer-events-none">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pointer-events-auto auto-rows-[360px]"
          >
            {sorted.map((project, i) => {
              const isLarge = i % 5 === 0 || i % 5 === 3
              const spanClass = isLarge ? "md:col-span-2" : "col-span-1"
              return (
                <div key={project.slug} className={spanClass}>
                  <ProjectCard project={project} index={i} />
                </div>
              )
            })}
          </motion.div>
        </SortableContext>
      </DndContext>
    </section>
  )
}
