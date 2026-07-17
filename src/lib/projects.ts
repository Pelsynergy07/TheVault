import fs from "fs"
import path from "path"
import type { Project } from "@/types"

const projectsDirectory = path.join(process.cwd(), "content", "projects")
const orderFilePath = path.join(process.cwd(), "content", "order.json")

function readOrder(): string[] {
  try {
    if (fs.existsSync(orderFilePath)) {
      const raw = fs.readFileSync(orderFilePath, "utf-8")
      return JSON.parse(raw) as string[]
    }
  } catch {}
  return []
}

function saveOrderToFile(slugs: string[]): void {
  fs.writeFileSync(orderFilePath, JSON.stringify(slugs, null, 2), "utf-8")
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDirectory)) return []

  const fileNames = fs.readdirSync(projectsDirectory)
  const projects = fileNames
    .filter((fn) => fn.endsWith(".json"))
    .map((fn) => {
      const fullPath = path.join(projectsDirectory, fn)
      const raw = fs.readFileSync(fullPath, "utf-8")
      return JSON.parse(raw) as Project
    })

  const order = readOrder()
  if (order.length > 0) {
    projects.sort((a, b) => {
      const ai = order.indexOf(a.slug)
      const bi = order.indexOf(b.slug)
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  } else {
    projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return projects
}

export function saveProjectOrder(slugs: string[]): void {
  saveOrderToFile(slugs)
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getAllProjects()
  return projects.find((p) => p.slug === slug) ?? null
}

export function getAllTags(): string[] {
  const projects = getAllProjects()
  const tags = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}

export function saveProject(project: Project): void {
  if (!fs.existsSync(projectsDirectory)) {
    fs.mkdirSync(projectsDirectory, { recursive: true })
  }
  const filePath = path.join(projectsDirectory, `${project.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(project, null, 2), "utf-8")
}
