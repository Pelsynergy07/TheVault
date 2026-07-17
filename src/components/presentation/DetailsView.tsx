"use client"

import { useState } from "react"
import { Code2, Save, X, Globe, Pencil, Check } from "lucide-react"
import type { Project, ProjectTag, ProjectStatus } from "@/types"

const ALL_TAGS: ProjectTag[] = [
  "AI", "XR", "Design Systems", "Chrome Extensions", "Agents",
  "Automation", "Research", "Product", "3D", "WebGL", "Mobile",
]

const STATUS_OPTIONS: ProjectStatus[] = ["Production", "Live", "Prototype", "Internal", "Hackathon"]

export function DetailsView({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    status: project.status,
    tags: [...project.tags],
    slides: project.slides.map((s) => ({ id: s.id, content: s.content })),
  })
  const [links, setLinks] = useState({
    demo: project.links.demo ?? "",
    github: project.links.github ?? "",
  })
  const [editLinks, setEditLinks] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const hasChanges =
    formData.title !== project.title ||
    formData.tagline !== project.tagline ||
    formData.description !== project.description ||
    formData.status !== project.status ||
    JSON.stringify(formData.tags) !== JSON.stringify(project.tags) ||
    JSON.stringify(formData.slides.map((s) => s.content)) !== JSON.stringify(project.slides.map((s) => s.content)) ||
    links.demo !== (project.links.demo ?? "") ||
    links.github !== (project.links.github ?? "")

  const toggleTag = (tag: ProjectTag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const updateSlide = (id: string, content: string) => {
    setFormData((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === id ? { ...s, content } : s)),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated: Project = {
        ...project,
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        status: formData.status,
        tags: formData.tags,
        slides: project.slides.map((s, i) => ({
          ...s,
          content: formData.slides[i]?.content ?? s.content,
        })),
        links: {
          demo: links.demo || undefined,
          github: links.github || undefined,
        },
      }
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] bg-[#0a0a0a] flex flex-col overflow-y-auto text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-white">Project Details</span>
          <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase border border-white/20 bg-white/5 text-white/70">
            {formData.status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-12 space-y-12">

        {/* Links */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-white/50 uppercase">Links</h3>
            <button
              onClick={() => setEditLinks(!editLinks)}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider text-white/40 border border-white/10 hover:text-white hover:border-white/30 transition-all"
            >
              <Pencil size={11} />
              {editLinks ? "Done" : "Edit Links"}
            </button>
          </div>

          {editLinks ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-sky-400 shrink-0" />
                <input
                  type="text"
                  value={links.demo}
                  onChange={(e) => setLinks({ ...links, demo: e.target.value })}
                  placeholder="Live Demo URL"
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <Code2 size={16} className="text-white/60 shrink-0" />
                <input
                  type="text"
                  value={links.github}
                  onChange={(e) => setLinks({ ...links, github: e.target.value })}
                  placeholder="GitHub URL"
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {links.demo ? (
                <a href={links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
                  <Globe size={16} className="text-sky-400" />
                  Live Demo
                </a>
              ) : (
                <span className="flex items-center gap-3 px-5 py-3 bg-white/[0.02] border border-white/5 text-white/20 text-sm">No demo link</span>
              )}
              {links.github ? (
                <a href={links.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
                  <Code2 size={16} className="text-white" />
                  GitHub
                </a>
              ) : (
                <span className="flex items-center gap-3 px-5 py-3 bg-white/[0.02] border border-white/5 text-white/20 text-sm">No GitHub link</span>
              )}
            </div>
          )}
        </section>

        {/* Status */}
        <section className="space-y-4">
          <h3 className="text-sm font-mono tracking-widest text-white/50 uppercase">Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFormData({ ...formData, status: s })}
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase border transition-all ${
                  formData.status === s
                    ? "bg-white/10 text-white border-white/30"
                    : "bg-transparent text-white/30 border-white/10 hover:text-white/60 hover:border-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section className="space-y-4">
          <h3 className="text-sm font-mono tracking-widest text-white/50 uppercase">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider border transition-all ${
                  formData.tags.includes(tag)
                    ? "bg-white/10 text-white border-white/30"
                    : "bg-transparent text-white/30 border-white/10 hover:text-white/60 hover:border-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Information & Save */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-white/50 uppercase">Information</h3>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase">Description</label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-y"
              />
            </div>
          </div>
        </section>

        {/* Slide Content */}
        <section className="space-y-6">
          <h3 className="text-sm font-mono tracking-widest text-white/50 uppercase">Presentation Slides</h3>
          <div className="space-y-6">
            {formData.slides.map((slide, i) => {
              const original = project.slides[i]
              return (
                <div key={slide.id} className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase">
                    {original?.title ?? slide.id}
                  </label>
                  <textarea
                    rows={4}
                    value={slide.content}
                    onChange={(e) => updateSlide(slide.id, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-y"
                  />
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
