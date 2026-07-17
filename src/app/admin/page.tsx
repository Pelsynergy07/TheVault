"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, AlertCircle } from "lucide-react"
import Link from "next/link"

const questions = [
  { key: "title", label: "Project Title", placeholder: "e.g. Neural Canvas" },
  { key: "tagline", label: "One-line tagline", placeholder: "e.g. AI-powered generative art in real-time" },
  { key: "problem", label: "What problem were you solving?", placeholder: "Describe the problem or gap..." },
  { key: "whyMattered", label: "Why did it matter?", placeholder: "Why was this important to solve?" },
  { key: "howBuilt", label: "How did you build it?", placeholder: "Tech stack, approach, timeline..." },
  { key: "biggestChallenge", label: "What was the biggest technical challenge?", placeholder: "The hardest engineering problem you faced..." },
  { key: "outcome", label: "What was the outcome or impact?", placeholder: "Results, metrics, learnings..." },
  { key: "improveNext", label: "What would you improve next?", placeholder: "If you rebuilt it today, what would you change?" },
  { key: "status", label: "Project Status", placeholder: "Production, Live, Prototype, Internal, or Hackathon" },
  { key: "tags", label: "Tags (comma-separated)", placeholder: "e.g. AI, 3D, WebGL" },
  { key: "demoUrl", label: "Live Demo URL", placeholder: "https://..." },
  { key: "githubUrl", label: "GitHub URL", placeholder: "https://..." },
]

export default function AdminPage() {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [slug, setSlug] = useState("")

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === "title") {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      )
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const tags = (form.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        slug,
        title: form.title ?? "Untitled",
        tagline: form.tagline ?? "",
        description: form.problem ?? "",
        status: form.status ?? "Prototype",
        tags,
        links: {
          demo: form.demoUrl || undefined,
          github: form.githubUrl || undefined,
        },
        slides: [
          { id: "problem", title: "The Problem", type: "problem", content: form.problem ?? "" },
          { id: "why", title: "Why It Mattered", type: "why", content: form.whyMattered ?? "" },
          { id: "solution", title: "How I Built It", type: "solution", content: form.howBuilt ?? "" },
          { id: "architecture", title: "Technical Challenge", type: "architecture", content: form.biggestChallenge ?? "" },
          { id: "results", title: "Outcome & Impact", type: "results", content: form.outcome ?? "" },
          { id: "learnings", title: "What I'd Improve", type: "learnings", content: form.improveNext ?? "" },
        ],
        questionnaire: {
          problem: form.problem ?? "",
          whyMattered: form.whyMattered ?? "",
          howBuilt: form.howBuilt ?? "",
          biggestChallenge: form.biggestChallenge ?? "",
          outcome: form.outcome ?? "",
          improveNext: form.improveNext ?? "",
        },
        date: new Date().toISOString().split("T")[0],
        featured: false,
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push(`/projects/${slug}`)
      } else {
        const body = await res.json()
        setError(body.error ?? "Failed to save project")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-dvh pt-24 px-6 pb-16">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          Back to Lab
        </Link>

        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-2">
          New Experiment
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Answer the questions below. A structured project page will be generated automatically.
        </p>

        <div className="space-y-8">
          {questions.map((q) => (
            <div key={q.key}>
              <label className="block text-sm font-mono text-foreground/80 mb-2">{q.label}</label>
              {q.key === "problem" || q.key === "whyMattered" || q.key === "howBuilt" ||
               q.key === "biggestChallenge" || q.key === "outcome" || q.key === "improveNext" ? (
                <textarea
                  value={form[q.key] ?? ""}
                  onChange={(e) => updateField(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 text-sm bg-surface backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/30 transition-colors duration-300 resize-vertical"
                />
              ) : (
                <input
                  type="text"
                  value={form[q.key] ?? ""}
                  onChange={(e) => updateField(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-3 text-sm bg-surface backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/30 transition-colors duration-300"
                />
              )}
            </div>
          ))}
        </div>

        {error && (
        <div className="mt-8 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-12">
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.title}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground text-sm font-mono hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            {submitting ? "Generating..." : "Generate Project"}
          </button>
        </div>
      </div>
    </main>
  )
}
