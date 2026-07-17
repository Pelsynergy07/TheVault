"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PresentationView } from "@/components/presentation/PresentationView"
import { DetailsView } from "@/components/presentation/DetailsView"
import { LayoutList, Presentation } from "lucide-react"
import type { Project } from "@/types"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"presentation" | "details">("presentation")

  useEffect(() => {
    fetch(`/api/projects/${params.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProject(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-sm font-mono text-white/50 animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="fixed inset-0 z-[90] bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-white/50">Project not found</p>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Back to Lab
        </button>
      </div>
    )
  }

  return (
    <>
      {viewMode === "presentation" ? (
        <PresentationView project={project} onClose={() => router.push("/")} />
      ) : (
        <DetailsView project={project} onClose={() => router.push("/")} />
      )}
      
      {/* View Toggle Floating Button */}
      <div className="fixed bottom-8 left-8 z-[100] flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
        <button
          onClick={() => setViewMode("presentation")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            viewMode === "presentation" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Presentation size={14} />
          Presentation
        </button>
        <button
          onClick={() => setViewMode("details")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            viewMode === "details" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <LayoutList size={14} />
          Details
        </button>
      </div>
    </>
  )
}
