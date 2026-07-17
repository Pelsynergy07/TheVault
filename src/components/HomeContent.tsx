"use client"

import { useEffect, useState } from "react"
import type { Project } from "@/types"
import { DigitalRainPreloader } from "./DigitalRainPreloader"
import { BioluminescenceBackground } from "./webgl/BioluminescenceBackground"
import { ProjectGrid } from "./ProjectGrid"

export function HomeContent() {
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then(setProjects)
  }, [])

  return (
    <>
      <DigitalRainPreloader loaded={!!projects} />
      <BioluminescenceBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-12">
        <div className="w-full max-w-7xl mx-auto px-6">
          {projects && <ProjectGrid projects={projects} />}
        </div>
      </main>
    </>
  )
}
