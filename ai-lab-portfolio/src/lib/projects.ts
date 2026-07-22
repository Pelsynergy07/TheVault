import { supabase } from "./supabase"
import type { Project } from "@/types"

export async function getAllProjects(): Promise<Project[]> {
  const { data: orderRow } = await supabase
    .from("project_order")
    .select("slugs")
    .eq("id", 1)
    .single()

  const orderMap = new Map<string, number>()
  const order = (orderRow?.slugs as string[]) ?? []
  order.forEach((slug, i) => orderMap.set(slug, i))

  const { data: rows } = await supabase
    .from("projects")
    .select("data")
    .order("created_at", { ascending: true })

  const projects = ((rows ?? []).map((r) => r.data) as Project[]).filter(Boolean)

  projects.sort((a, b) => {
    const ai = orderMap.get(a.slug)
    const bi = orderMap.get(b.slug)
    if (ai === undefined && bi === undefined) return 0
    if (ai === undefined) return 1
    if (bi === undefined) return -1
    return ai - bi
  })

  return projects
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await supabase
    .from("projects")
    .select("data")
    .eq("slug", slug)
    .single()

  return (data?.data as Project) ?? null
}

export async function getAllTags(): Promise<string[]> {
  const projects = await getAllProjects()
  const tags = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}

export async function saveProject(project: Project): Promise<void> {
  const { error } = await supabase.from("projects").upsert(
    { slug: project.slug, data: project },
    { onConflict: "slug" },
  )
  if (error) throw new Error(error.message)
}

export async function deleteProject(slug: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("slug", slug)
  if (error) throw new Error(error.message)
}

export async function saveProjectOrder(slugs: string[]): Promise<void> {
  const { error } = await supabase
    .from("project_order")
    .update({ slugs })
    .eq("id", 1)

  if (error) throw new Error(error.message)
}
