import { ProjectGrid } from "@/components/ProjectGrid"
import { BioluminescenceBackground } from "@/components/webgl/BioluminescenceBackground"
import { DigitalRainPreloader } from "@/components/DigitalRainPreloader"
import { getAllProjects } from "@/lib/projects"

export const dynamic = "force-dynamic"

export default async function Home() {
  const projects = await getAllProjects()

  return (
    <>
      <DigitalRainPreloader />
      <BioluminescenceBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-12">
        <div className="w-full max-w-7xl mx-auto px-6">
          <ProjectGrid projects={projects} />
        </div>
      </main>
    </>
  )
}
