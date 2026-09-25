import { NextResponse } from "next/server"
import { getProjectBySlug, deleteProject } from "@/lib/projects"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(project)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await deleteProject(slug)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/projects/[slug] error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
