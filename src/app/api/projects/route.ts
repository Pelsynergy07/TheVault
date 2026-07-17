import { NextResponse } from "next/server"
import { getAllProjects, saveProject } from "@/lib/projects"
import type { Project } from "@/types"

export async function GET() {
  const projects = getAllProjects()
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Project
    saveProject(data)
    return NextResponse.json({ success: true, slug: data.slug })
  } catch {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}
