"use client"

import { useEffect, useState, useRef } from "react"
import type { Project } from "@/types"
import { DigitalRainPreloader } from "./DigitalRainPreloader"
import { BioluminescenceBackground } from "./webgl/BioluminescenceBackground"
import { ProjectGrid } from "./ProjectGrid"

let cached: Project[] | null = null
let lastFetch = 0
const REFRESH_MS = 3_000
let fetchPromise: Promise<Project[]> | null = null

async function getCachedProjects(): Promise<Project[]> {
  const now = Date.now()
  if (cached && now - lastFetch < REFRESH_MS) {
    return cached
  }
  if (fetchPromise) {
    return fetchPromise
  }
  fetchPromise = fetch("/api/projects")
    .then((res) => (res.ok ? res.json() : []))
    .then((data: Project[]) => {
      cached = data
      lastFetch = Date.now()
      fetchPromise = null
      return data
    })
  return fetchPromise
}

export function HomeContent() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    getCachedProjects().then(setProjects)

    refreshTimer.current = setInterval(async () => {
      const data = await getCachedProjects()
      setProjects(data)
    }, REFRESH_MS)

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current)
    }
  }, [])

  return (
    <>
      <DigitalRainPreloader loaded={!!projects} />
      <BioluminescenceBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center pt-20 sm:pt-24 pb-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          {projects && <ProjectGrid projects={projects} />}
        </div>
      </main>
    </>
  )
}
