export type ProjectStatus = "Production" | "Live" | "Prototype" | "Internal" | "Hackathon"

export type ProjectTag =
  | "AI"
  | "XR"
  | "Design Systems"
  | "Chrome Extensions"
  | "Agents"
  | "Automation"
  | "Research"
  | "Product"
  | "3D"
  | "WebGL"
  | "Mobile"

export interface SlideContent {
  id: string
  title: string
  type: "problem" | "why" | "solution" | "architecture" | "results" | "learnings"
  content: string
  media?: {
    type: "image" | "video" | "diagram"
    src: string
    alt?: string
  }
  links?: {
    label: string
    url: string
  }[]
}

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  status: ProjectStatus
  tags: ProjectTag[]
  links: {
    demo?: string
    github?: string
    caseStudy?: string
  }
  slides: SlideContent[]
  questionnaire: {
    problem: string
    whyMattered: string
    howBuilt: string
    biggestChallenge: string
    outcome: string
    improveNext: string
  }
  date: string
  featured: boolean
  color?: string
}
