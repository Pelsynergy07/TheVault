"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, AlertCircle, FileJson, X, Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

const questions = [
  { key: "title", label: "Project Title", placeholder: "e.g. Neural Canvas" },
  { key: "problem", label: "The problem I was trying to solve for", placeholder: "Describe the problem or gap..." },
  { key: "approach", label: "My approach to solving this", placeholder: "Tech stack, approach, timeline..." },
  { key: "biggestChallenge", label: "Biggest challenge", placeholder: "The hardest engineering problem you faced..." },
  { key: "outcome", label: "Outcome", placeholder: "Results, metrics, learnings..." },
  { key: "skills", label: "Skills unlocked", placeholder: "What did you learn or get better at?" },
  { key: "status", label: "Project Status", placeholder: "Production, Live, Prototype, Internal, or Hackathon" },
  { key: "tags", label: "Tags (comma-separated)", placeholder: "e.g. AI, 3D, WebGL" },
  { key: "demoUrl", label: "Live Demo URL", placeholder: "https://..." },
  { key: "githubUrl", label: "GitHub URL", placeholder: "https://..." },
]

const AI_PROMPT_TEMPLATE = `You are an expert technical writer and product storyteller generating a project case study for The Vault, an AI Lab Portfolio and experimental operating system.

### Purpose:
The Vault showcases cutting-edge AI, XR, automation, design systems, and product engineering experiments. Each project is a mini case-study and a 6-slide presentation deck.

### Your Task:
Given the raw project context, code snippets, notes, or explanations provided at the bottom, analyze the work and produce a single, strictly valid JSON object adhering to The Vault's schema.

### Editorial Guidelines:
- Tone: Engineering-first, opinionated, articulate, punchy. No marketing buzzwords or corporate filler.
- Craft: Highlight real architectural decisions, bottlenecks, trade-offs, and lessons learned.
- Formatting: Clean markdown with bullet points (-), bolding (**), inline backticks for code.

### JSON Schema:
{
  "slug": "<lowercase-kebab-case-slug>",
  "title": "<Punchy Project Name>",
  "tagline": "<One-sentence technical value proposition under 120 chars>",
  "description": "<2-4 bullet points highlighting the core mission and innovation>",
  "status": "<'Production' | 'Live' | 'Prototype' | 'Internal' | 'Hackathon'>",
  "tags": ["<Array of: 'AI', 'XR', 'Design Systems', 'Chrome Extensions', 'Agents', 'Automation', 'Research', 'Product', '3D', 'WebGL', 'Mobile'>"],
  "links": {
    "demo": "<https URL to demo or omit>",
    "github": "<https URL to repo or omit>",
    "caseStudy": "<https URL or omit>"
  },
  "slides": [
    { "id": "slide-1", "type": "problem", "title": "The Problem", "content": "- Specific pain points\\n- Why previous solutions failed\\n- The core tension addressed" },
    { "id": "slide-2", "type": "why", "title": "Why It Matters", "content": "Why this problem is important now.\\n\\n- The broader paradigm shift.\\n- Developer leverage unlocked." },
    { "id": "slide-3", "type": "solution", "title": "The Solution", "content": "What was built and how it fundamentally works.\\n\\n- User or developer interface.\\n- Core mechanics." },
    { "id": "slide-4", "type": "architecture", "title": "Technical Architecture", "content": "Technical stack breakdown and data flow:\\n\\n- Frontend & state\\n- Backend & APIs\\n- Hardest challenge solved" },
    { "id": "slide-5", "type": "results", "title": "Results & Impact", "content": "- Concrete metrics or qualitative outcomes.\\n- Performance improvements." },
    { "id": "slide-6", "type": "learnings", "title": "Learnings & Next Steps", "content": "- Key takeaways and skills unlocked.\\n- What's next on the roadmap." }
  ],
  "questionnaire": {
    "problem": "<Direct concise summary of the problem>",
    "whyMattered": "<Direct concise summary of why it mattered>",
    "howBuilt": "<Technical approach, tools, stack>",
    "biggestChallenge": "<The hardest technical hurdle>",
    "outcome": "<The tangible result / metric>",
    "improveNext": "<Skills unlocked or next improvements>"
  },
  "date": "YYYY-MM-DD",
  "featured": false,
  "color": "<Hex accent like #8b5cf6, #14b8a6, #f59e0b, #06b6d4>"
}

### Constraints:
1. Return ONLY the raw JSON object inside a \`\`\`json\`\`\` code block.
2. Ensure valid JSON syntax with properly escaped strings.

---
### [PASTE YOUR RAW PROJECT CONTEXT HERE]
- Project Name: 
- What does it do?
- What tech stack / tools were used?
- What was the hardest problem solved?
- Links (GitHub, demo, etc.):
- Any raw brainstorm notes, README text, or terminal outputs:
`

export default function AdminPage() {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [slug, setSlug] = useState("")
  const [showJsonImport, setShowJsonImport] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [showPromptPreview, setShowPromptPreview] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState("")
  const jsonRef = useRef<HTMLTextAreaElement>(null)

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2500)
    } catch {
      // Fallback if clipboard API restricted
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2500)
    }
  }

  const handleJsonImport = () => {
    setJsonError("")
    try {
      const data = JSON.parse(jsonInput)
      const newForm: Record<string, string> = {}

      if (data.title) {
        newForm.title = data.title
        setSlug(
          data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        )
      }
      if (data.questionnaire?.problem) newForm.problem = data.questionnaire.problem
      if (data.questionnaire?.whyMattered) newForm.whyMattered = data.questionnaire.whyMattered
      if (data.questionnaire?.howBuilt) newForm.approach = data.questionnaire.howBuilt
      if (data.biggestChallenge) newForm.biggestChallenge = data.biggestChallenge
      if (data.questionnaire?.biggestChallenge) newForm.biggestChallenge = data.questionnaire.biggestChallenge
      if (data.questionnaire?.outcome) newForm.outcome = data.questionnaire.outcome
      if (data.questionnaire?.improveNext) newForm.skills = data.questionnaire.improveNext
      if (data.status) newForm.status = data.status
      if (Array.isArray(data.tags)) newForm.tags = data.tags.join(", ")
      if (data.links?.demo) newForm.demoUrl = data.links.demo
      if (data.links?.github) newForm.githubUrl = data.links.github

      setForm((prev) => ({ ...prev, ...newForm }))
      setShowJsonImport(false)
      setJsonInput("")
    } catch {
      setJsonError("Invalid JSON. Please check the format and try again.")
    }
  }

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
        description: form.problem ?? "",
        status: form.status ?? "Prototype",
        tags,
        links: {
          demo: form.demoUrl || undefined,
          github: form.githubUrl || undefined,
        },
        slides: [
          { id: "problem", title: "The Problem", type: "problem", content: form.problem ?? "" },
          { id: "why", title: "Why It Mattered", type: "why", content: form.problem ?? "" },
          { id: "solution", title: "My Approach", type: "solution", content: form.approach ?? "" },
          { id: "architecture", title: "Biggest Challenge", type: "architecture", content: form.biggestChallenge ?? "" },
          { id: "results", title: "Outcome", type: "results", content: form.outcome ?? "" },
          { id: "learnings", title: "Skills Unlocked", type: "learnings", content: form.skills ?? "" },
        ],
        questionnaire: {
          problem: form.problem ?? "",
          whyMattered: form.problem ?? "",
          howBuilt: form.approach ?? "",
          biggestChallenge: form.biggestChallenge ?? "",
          outcome: form.outcome ?? "",
          improveNext: form.skills ?? "",
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
    <main className="min-h-dvh pt-20 sm:pt-24 px-4 sm:px-6 pb-16">
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
        <p className="text-sm text-muted-foreground mb-6">
          Answer the questions below, or paste a JSON export from ChatGPT.
        </p>

        <div className="mb-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowJsonImport(!showJsonImport)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-muted-foreground/70 border border-border/30 hover:border-accent/30 hover:text-foreground transition-colors"
            >
              <FileJson size={14} />
              {showJsonImport ? "Close Import" : "Import from JSON"}
            </button>

            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono border border-border/30 hover:border-accent/30 text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              {copiedPrompt ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-accent" />
                  <span>Copy AI Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowPromptPreview(!showPromptPreview)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showPromptPreview ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              <span>{showPromptPreview ? "Hide Template" : "View Prompt"}</span>
            </button>
          </div>

          {showPromptPreview && (
            <div className="p-4 bg-surface/90 border border-border/50 backdrop-blur-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground/70">
                <span>AI Prompt Template (Paste into ChatGPT / Claude with your notes)</span>
                <button
                  onClick={handleCopyPrompt}
                  className="text-accent hover:underline text-xs"
                >
                  {copiedPrompt ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-foreground/80 bg-black/50 p-3 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-border/30">
                {AI_PROMPT_TEMPLATE}
              </pre>
            </div>
          )}

          {showJsonImport && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground/70">Paste the JSON from ChatGPT below</span>
                <button
                  onClick={() => { setShowJsonImport(false); setJsonError(""); setJsonInput("") }}
                  className="text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <textarea
                ref={jsonRef}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"title": "...", ...}'
                rows={8}
                className="w-full px-4 py-3 text-xs font-mono bg-surface backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/30 transition-colors duration-300 resize-vertical"
              />
              {jsonError && (
                <p className="text-xs text-red-400">{jsonError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleJsonImport}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  <FileJson size={12} />
                  Import
                </button>
                <button
                  onClick={() => { setForm({}); setSlug("") }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-muted-foreground/70 border border-border/30 hover:border-red-400/30 hover:text-red-400 transition-colors"
                >
                  Clear All Fields
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {questions.map((q) => (
            <div key={q.key}>
              <label className="block text-sm font-mono text-foreground/80 mb-2">{q.label}</label>
              {q.key === "problem" || q.key === "approach" ||
               q.key === "biggestChallenge" || q.key === "outcome" || q.key === "skills" ? (
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
