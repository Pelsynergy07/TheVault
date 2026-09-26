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

const AI_PROMPT_TEMPLATE = `You are an empathetic product designer and thoughtful storyteller writing a project case study for The Vault, a portfolio of AI experiments and digital products.

### Purpose:
The Vault showcases meaningful experiments in AI, human-computer interaction, and digital product design. Each project is an honest story told across a 6-slide presentation deck and project profile.

### Your Perspective & Mindset:
Write from the perspective of an authentic designer-builder speaking in a candid, conversational first-person voice ("I").
- Match these exact voice examples:
  "WhisperFlow has changed the way I interact with my computer, BUT it's another Rs. 400 subscription, and it was sending everything I was saying to their server. This, I did not like so much."
  "Vibe-coded a light-weight application that lives in the background and transcribes, corrects grammar, and formats fully locally and very fast."
- Keep it honest & direct: Don't sanitize raw thoughts into corporate PR copy. If you were annoyed by subscriptions, privacy doubts, or clumsy workflows, say it directly.
- ABSOLUTELY NO technical posturing: Avoid low-level framework or library jargon (no "PyTorch", "CUDA", "ONNX", "DAG scheduling", "microservices", "GLSL shaders", "state hydration"). Describe what it does for the person in plain terms (e.g. "runs completely on my laptop without touching the cloud").
- Plain, human English: Talk about personal habits, daily friction, privacy peace of mind, and how it feels to use.

### Editorial Guidelines:
- Tone: Candid, straightforward, personal, grounded. Zero corporate jargon, zero marketing fluff, zero buzzword soup, zero low-level engineering posturing. Talk like a real person sharing an honest project story.
- Narrative: Frame the core friction as a relatable human experience.
- Formatting: Clean markdown with bullet points (-), bolding (**).

### JSON Schema:
{
  "slug": "<lowercase-kebab-case-slug>",
  "title": "<Punchy, clean Project Name>",
  "tagline": "<One plain-English sentence capturing the human benefit under 120 chars>",
  "description": "<2-4 conversational bullet points highlighting the real-world friction and what the product does for the user>",
  "status": "<'Production' | 'Live' | 'Prototype' | 'Internal' | 'Hackathon'>",
  "tags": ["<Array of: 'AI', 'XR', 'Design Systems', 'Chrome Extensions', 'Agents', 'Automation', 'Research', 'Product', '3D', 'WebGL', 'Mobile'>"],
  "links": {
    "demo": "<https URL to demo or omit>",
    "github": "<https URL to repo or omit>",
    "caseStudy": "<https URL or omit>"
  },
  "slides": [
    { "id": "slide-1", "type": "problem", "title": "The Problem", "content": "- Everyday frustration or friction in plain language\\n- Why existing tools feel overwhelming or clunky\\n- How people actually feel dealing with this" },
    { "id": "slide-2", "type": "why", "title": "Why It Matters", "content": "Why this problem deserves attention right now.\\n\\n- Real-world friction or emotional toll.\\n- How fixing this changes daily workflow or peace of mind." },
    { "id": "slide-3", "type": "solution", "title": "My Approach", "content": "How the experience was designed to feel natural.\\n\\n- The user's point of view.\\n- How the interface guides the user without friction." },
    { "id": "slide-4", "type": "architecture", "title": "Biggest Challenge", "content": "The hardest part of getting the experience right (product and interaction hurdles):\\n\\n- Figuring out the right mental model or flow\\n- Balancing simplicity with capability" },
    { "id": "slide-5", "type": "results", "title": "Outcome & Impact", "content": "- How it performs in real hands (daily use, personal testing, peer feedback).\\n- Tangible difference made." },
    { "id": "slide-6", "type": "learnings", "title": "Skills & Lessons Learned", "content": "- Key takeaways about habits or product design.\\n- Design disciplines or interaction patterns refined." }
  ],
  "questionnaire": {
    "problem": "<Direct plain-English summary of the human friction>",
    "whyMattered": "<Why this matters for everyday people or users>",
    "howBuilt": "<Design approach, prototyping tools, and practical build stack>",
    "biggestChallenge": "<The hardest interaction, design, or user experience hurdle>",
    "outcome": "<The real-world outcome, usage, or feedback>",
    "improveNext": "<Design skills unlocked and planned user-facing refinements>"
  },
  "date": "YYYY-MM-DD",
  "featured": false,
  "color": "<Hex accent like #8b5cf6, #14b8a6, #f59e0b, #06b6d4>"
}

### Constraints:
1. Return ONLY the raw JSON object inside a \`\`\`json\`\`\` code block.
2. Plain language only: if a 12-year-old or non-tech friend wouldn't understand a phrase, rephrase it around human experience and design intent.
3. Ensure valid JSON syntax with properly escaped strings.

---
### [PASTE YOUR RAW PROJECT CONTEXT HERE]
- Project Name / Idea:
- What real-world problem or frustration did you notice?
- Who did you design this for, and how does the experience work?
- What tools / stack did you use to build it?
- What was the hardest design or product hurdle to get right?
- What were the results or user reactions?
- Any rough notes, sketches, thoughts, or reflections:
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
