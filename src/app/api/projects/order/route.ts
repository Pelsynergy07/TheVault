import { NextResponse } from "next/server"
import { saveProjectOrder } from "@/lib/projects"

export async function POST(request: Request) {
  try {
    const { slugs } = (await request.json()) as { slugs: string[] }
    saveProjectOrder(slugs)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 })
  }
}
