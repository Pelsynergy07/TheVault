"use client"

import { useEffect, useRef } from "react"

export function TexturedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Track mouse with smooth damping (lerp)
    const mouse = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.4,
      targetX: window.innerWidth * 0.5,
      targetY: window.innerHeight * 0.4,
      active: false,
    }

    let width = 0
    let height = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    // Harmonic floating orbs configuration
    const orbs = [
      {
        baseX: 0.25,
        baseY: 0.35,
        radius: 0.48,
        colorStart: "rgba(124, 58, 237, 0.24)", // Deep Electric Violet
        colorEnd: "rgba(124, 58, 237, 0)",
        speedX: 0.0006,
        speedY: 0.0008,
        amplitudeX: 0.12,
        amplitudeY: 0.10,
        phase: 0,
      },
      {
        baseX: 0.75,
        baseY: 0.40,
        radius: 0.50,
        colorStart: "rgba(14, 165, 233, 0.18)", // Ethereal Cyan / Sky
        colorEnd: "rgba(14, 165, 233, 0)",
        speedX: 0.0007,
        speedY: 0.0005,
        amplitudeX: 0.14,
        amplitudeY: 0.12,
        phase: Math.PI / 2,
      },
      {
        baseX: 0.50,
        baseY: 0.75,
        radius: 0.44,
        colorStart: "rgba(245, 158, 11, 0.11)", // Subtle Warm Amber
        colorEnd: "rgba(245, 158, 11, 0)",
        speedX: 0.0005,
        speedY: 0.0007,
        amplitudeX: 0.10,
        amplitudeY: 0.08,
        phase: Math.PI,
      },
    ]

    const startTime = performance.now()

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const t = prefersReducedMotion ? 0 : elapsed

      // Smooth mouse interpolation (spring feel)
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      // Deep dark canvas base (#08080a)
      ctx.fillStyle = "#08080a"
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "screen"

      // Render floating harmonic gradient orbs
      const minDimension = Math.min(width, height)
      for (const orb of orbs) {
        const x = (orb.baseX + Math.sin(t * orb.speedX + orb.phase) * orb.amplitudeX) * width
        const y = (orb.baseY + Math.cos(t * orb.speedY + orb.phase) * orb.amplitudeY) * height
        const r = orb.radius * minDimension

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, orb.colorStart)
        grad.addColorStop(0.5, orb.colorStart.replace(/[\d\.]+\)$/, "0.08)"))
        grad.addColorStop(1, orb.colorEnd)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Render interactive mouse tracking orb
      if (mouse.active || prefersReducedMotion === false) {
        const mouseRadius = minDimension * 0.35
        const mouseGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseRadius,
        )
        // Soft responsive ambient glow
        mouseGrad.addColorStop(0, "rgba(168, 85, 247, 0.14)")
        mouseGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.06)")
        mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = mouseGrad
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"

      // Soft vignette to frame the canvas
      const vigGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        minDimension * 0.4,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75,
      )
      vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)")
      vigGrad.addColorStop(1, "rgba(5, 5, 7, 0.55)")
      ctx.fillStyle = vigGrad
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 2D Canvas with Smooth Mesh Gradient */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />

      {/* Ultra-Dense, Micro-Grain Tactile Layer (crisp, delicate, visible) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08] mix-blend-screen contrast-[130%]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="vault-micro-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.90"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#vault-micro-grain)" />
      </svg>
    </div>
  )
}
