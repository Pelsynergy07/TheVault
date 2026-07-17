"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KEY = "vault_preloader_played"

export function DigitalRainPreloader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false
    return !sessionStorage.getItem(KEY)
  })

  useEffect(() => {
    if (!isVisible) {
      const el = document.getElementById("vault-initial-overlay")
      if (el) el.remove()
      return
    }
    sessionStorage.setItem(KEY, "1")
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number, height: number, dpr: number;

    const FALL_SPEED = 1.0;
    const COLUMN_DENSITY = 0.7;

    const katakana = '\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3';
    const numbers = '0123456789';
    const mathSymbols = '\u00D7\u00F7\u2206\u03A3\u03A0\u221A\u221E\u2248\u2260\u2264\u2265\u222B\u2202\u03B1\u03B2\u03B3\u03B8\u03C6\u03C8\u03C9';
    const allChars = katakana + numbers + mathSymbols;

    function randomChar() {
      return allChars[Math.floor(Math.random() * allChars.length)];
    }

    const FONT_SIZE = 16;
    interface Column {
      x: number; y: number; speed: number; length: number;
      chars: { char: string; cycleTimer: number; cycleRate: number }[];
      active: boolean; restartDelay: number; opacity: number; hitWater: boolean;
    }
    interface Ripple {
      x: number; y: number; radius: number; maxRadius: number;
      speed: number; life: number; decay: number;
    }
    interface WavePoint { y: number; vy: number; }

    let columns: Column[] = [];
    let waterSurface = 0;
    const ripples: Ripple[] = [];
    const MAX_RIPPLES = 40;
    let wavePoints: WavePoint[] = [];
    const WAVE_RESOLUTION = 4;

    function initColumns() {
      waterSurface = height * 0.78;
      const colWidth = FONT_SIZE;
      const colCount = Math.floor(width / colWidth);
      const newColumns = [];

      for (let i = 0; i < colCount; i++) {
        const existing = columns[i];
        if (existing) {
          existing.x = i * colWidth;
          newColumns.push(existing);
        } else {
          newColumns.push(createColumn(i, true));
        }
      }
      columns = newColumns;

      const waveCount = Math.ceil(width / WAVE_RESOLUTION) + 1;
      const newWave = [];
      for (let w = 0; w < waveCount; w++) {
        newWave.push({ y: 0, vy: 0 });
      }
      wavePoints = newWave;
    }

    function createColumn(index: number, scatter: boolean) {
      const trailLen = 12 + Math.floor(Math.random() * 20);
      const maxChars = trailLen + 5;
      const chars = [];
      for (let j = 0; j < maxChars; j++) {
        chars.push({
          char: randomChar(),
          cycleTimer: Math.random() * 3,
          cycleRate: 0.5 + Math.random() * 2
        });
      }

      let startY;
      if (scatter) {
        if (Math.random() < COLUMN_DENSITY) {
          startY = Math.random() * (waterSurface + trailLen * FONT_SIZE) - trailLen * FONT_SIZE * 0.3;
        } else {
          startY = -trailLen * FONT_SIZE - Math.random() * height * 0.5;
        }
      } else {
        startY = -trailLen * FONT_SIZE * Math.random() * 0.3;
      }

      return {
        x: index * FONT_SIZE,
        y: startY,
        speed: 1.2 + Math.random() * 2.5,
        length: trailLen,
        chars: chars,
        active: scatter ? Math.random() < (COLUMN_DENSITY + 0.2) : Math.random() < COLUMN_DENSITY,
        restartDelay: 0,
        opacity: 0.6 + Math.random() * 0.4,
        hitWater: false
      };
    }

    function spawnRipple(x: number, y: number) {
      if (ripples.length >= MAX_RIPPLES) {
        ripples.shift();
      }
      ripples.push({
        x: x,
        y: y,
        radius: 0,
        maxRadius: 30 + Math.random() * 50,
        speed: 20 + Math.random() * 30,
        life: 1.0,
        decay: 0.3 + Math.random() * 0.2
      });
    }

    function disturbWave(x: number, force: number) {
      const idx = Math.floor(x / WAVE_RESOLUTION);
      const spread = 3;
      for (let i = -spread; i <= spread; i++) {
        const wi = idx + i;
        if (wi >= 0 && wi < wavePoints.length) {
          const influence = 1 - Math.abs(i) / (spread + 1);
          wavePoints[wi].vy += force * influence;
        }
      }
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initColumns();
    }

    window.addEventListener('resize', resize);
    resize();

    let startTime = 0;
    const RAIN_DELAY = 0.4;
    let lastTime = 0;
    function render(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      if (elapsed < RAIN_DELAY) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const time = timestamp / 1000;

      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = '#0a0a0a';
      ctx!.fillRect(0, 0, width, height);

      // Update Columns
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!col.active) {
          col.restartDelay -= dt;
          if (col.restartDelay <= 0) {
            if (Math.random() < COLUMN_DENSITY) {
              col.active = true;
              col.y = -col.length * FONT_SIZE * Math.random() * 0.3;
              col.speed = 1.2 + Math.random() * 2.5;
              col.length = 12 + Math.floor(Math.random() * 20);
              col.opacity = 0.6 + Math.random() * 0.4;
              col.hitWater = false;
              for (let c = 0; c < col.chars.length; c++) {
                col.chars[c].char = randomChar();
              }
            } else {
              col.restartDelay = 0.3 + Math.random() * 1.5;
            }
          }
          continue;
        }

        const prevY = col.y;
        col.y += col.speed * FALL_SPEED * dt * 60;

        for (let j = 0; j < col.chars.length; j++) {
          col.chars[j].cycleTimer -= dt;
          if (col.chars[j].cycleTimer <= 0) {
            col.chars[j].char = randomChar();
            col.chars[j].cycleTimer = col.chars[j].cycleRate;
          }
        }

        if (!col.hitWater && col.y >= waterSurface && prevY < waterSurface) {
          col.hitWater = true;
          spawnRipple(col.x + FONT_SIZE * 0.5, waterSurface);
          disturbWave(col.x + FONT_SIZE * 0.5, -2 - Math.random() * 3);
        }

        const tailY = col.y - col.length * FONT_SIZE;
        if (tailY > waterSurface + 30) {
          col.active = false;
          col.restartDelay = 0.2 + Math.random() * 2;
        }
      }

      // Update Ripples
      let i = ripples.length;
      while (i--) {
        const r = ripples[i];
        r.radius += r.speed * dt;
        r.life -= r.decay * dt;
        if (r.life <= 0 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update Waves
      const damping = 0.97;
      const tension = 0.03;
      const spread = 0.25;

      for (let i = 0; i < wavePoints.length; i++) {
        const p = wavePoints[i];
        p.vy += -tension * p.y;
        p.vy *= damping;
        p.y += p.vy;
      }

      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < wavePoints.length; i++) {
          if (i > 0) {
            wavePoints[i].vy += spread * (wavePoints[i - 1].y - wavePoints[i].y);
          }
          if (i < wavePoints.length - 1) {
            wavePoints[i].vy += spread * (wavePoints[i + 1].y - wavePoints[i].y);
          }
        }
      }

      // Draw Columns
      ctx!.font = FONT_SIZE + 'px "SF Mono", "Fira Code", "Cascadia Code", monospace';
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'top';

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!col.active) continue;

        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * FONT_SIZE;
          if (charY > waterSurface) continue;
          if (charY < -FONT_SIZE) continue;

          const charIndex = j % col.chars.length;
          const trailFraction = j / col.length;
          let brightness;

          if (j === 0) {
            brightness = 1.0;
          } else if (j === 1) {
            brightness = 0.9;
          } else if (j < 4) {
            brightness = 0.75 - (j - 2) * 0.08;
          } else {
            brightness = Math.max(0, 0.6 * (1 - trailFraction));
          }

          const distToWater = waterSurface - charY;
          if (distToWater < FONT_SIZE * 3) {
            brightness *= Math.max(0, distToWater / (FONT_SIZE * 3));
          }

          brightness *= col.opacity;
          if (brightness < 0.02) continue;

          let r, g, b;
          if (j === 0) {
            r = 255; g = 245; b = 220;
          } else if (j < 3) {
            r = 240; g = 200; b = 140;
          } else {
            r = 200; g = 149; b = 108;
          }

          ctx!.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + brightness + ')';

          if (j === 0) {
            ctx!.shadowColor = 'rgba(255, 220, 160, 0.6)';
            ctx!.shadowBlur = 8;
          }

          ctx!.fillText(col.chars[charIndex].char, col.x + FONT_SIZE * 0.5, charY);

          if (j === 0) {
            ctx!.shadowColor = 'transparent';
            ctx!.shadowBlur = 0;
          }
        }
      }

      // Draw Water Surface & ripples
      const waterGrad = ctx!.createLinearGradient(0, waterSurface, 0, height);
      waterGrad.addColorStop(0, 'rgba(15, 13, 11, 0.6)');
      waterGrad.addColorStop(0.3, 'rgba(12, 11, 10, 0.85)');
      waterGrad.addColorStop(1, 'rgba(10, 10, 10, 0.95)');
      ctx!.fillStyle = waterGrad;
      ctx!.fillRect(0, waterSurface - 2, width, height - waterSurface + 2);

      ctx!.beginPath();
      for (let x = 0; x <= width; x += WAVE_RESOLUTION) {
        const idx = Math.floor(x / WAVE_RESOLUTION);
        const waveY = idx < wavePoints.length ? wavePoints[idx].y : 0;
        const ambient = Math.sin(x * 0.01 + time * 0.8) * 1.5
                    + Math.sin(x * 0.023 + time * 0.5) * 1.0
                    + Math.sin(x * 0.007 + time * 0.3) * 2.0;
        const py = waterSurface + waveY + ambient;

        if (x === 0) {
          ctx!.moveTo(x, py);
        } else {
          ctx!.lineTo(x, py);
        }
      }
      ctx!.strokeStyle = 'rgba(200, 170, 130, 0.25)';
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const alpha = r.life * 0.3;
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = r.radius - ring * 8;
          if (ringRadius <= 0) continue;
          const ringAlpha = alpha * (1 - ring * 0.3);
          ctx!.beginPath();
          ctx!.ellipse(r.x, r.y + ring * 2, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2);
          ctx!.strokeStyle = 'rgba(200, 170, 130, ' + ringAlpha + ')';
          ctx!.lineWidth = 1 - ring * 0.2;
          ctx!.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%", filter: "blur(10px)" }}
          transition={{ duration: 2.2, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] pointer-events-none"
        >
          <canvas ref={canvasRef} className="block w-full h-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
