"use client"

import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase text-foreground/40 border border-border/50 mb-8">
              R&amp;D Lab · Est. 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight leading-[0.9] text-foreground"
          >
            Building at the
            <br />
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#0d7377] to-[#6d28d9] bg-clip-text text-transparent">
              edge of possible
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            AI, XR, automation, and product experiments. I prototype ambitious
            ideas quickly and ship what I learn. This is the lab notebook.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {["AI", "XR", "Automation", "Research", "Product"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-xs font-mono tracking-wider text-muted-foreground/60 border border-border/40 hover:text-accent hover:border-accent/30 transition-all duration-500"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
