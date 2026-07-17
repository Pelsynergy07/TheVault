import { ProjectGrid } from "@/components/ProjectGrid"
import { BioluminescenceBackground } from "@/components/webgl/BioluminescenceBackground"
import { DigitalRainPreloader } from "@/components/DigitalRainPreloader"

export default function Home() {
  return (
    <>
      <DigitalRainPreloader />
      <BioluminescenceBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-12">
        <div className="w-full max-w-7xl mx-auto px-6">
          <ProjectGrid />
        </div>
      </main>
    </>
  )
}
