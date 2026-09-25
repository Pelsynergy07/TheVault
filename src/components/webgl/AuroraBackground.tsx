"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec2 uResolution;
uniform float uTime;
uniform float uMouseX;
uniform float uMouseY;

varying vec2 vUv;

vec3 aurora(vec2 uv, float time, vec2 mouse) {
  vec3 col = vec3(0.0);

  float dist = length(uv - vec2(0.5));
  float vignette = 1.0 - dist * 0.8;

  vec2 movement = vec2(time * 0.02, time * 0.01);
  vec2 mouseOffset = mouse * 0.1;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 p = uv + movement * (fi * 0.3 + 1.0) + mouseOffset * (fi * 0.1);

    float wave1 = sin(p.x * 2.5 + fi + time * 0.15) * 0.5;
    float wave2 = sin(p.y * 2.0 - fi * 0.7 + time * 0.12) * 0.4;
    float wave3 = sin((p.x + p.y) * 1.8 + fi * 1.3 + time * 0.09) * 0.3;

    float intensity = wave1 * wave2 + wave3 * 0.5;
    intensity = clamp(intensity * 1.5 + 0.3, 0.0, 1.0);

    float falloff = exp(-length(p - vec2(0.5 + mouse.x * 0.1)) * 2.0 + fi * 0.3);

    vec3 color1 = vec3(0.42, 0.05, 0.68);
    vec3 color2 = vec3(0.05, 0.45, 0.47);
    vec3 color3 = vec3(0.10, 0.02, 0.20);

    float t = fi / 4.0;
    vec3 bandColor = mix(mix(color1, color2, t), color3, sin(t * 3.14) * 0.3);

    col += bandColor * intensity * falloff * (0.5 + fi * 0.15);
  }

  col *= vignette * 0.35;
  col += vec3(0.02, 0.01, 0.04);
  return col;
}

void main() {
  vec2 uv = vUv;
  vec3 color = aurora(uv, uTime, vec2(uMouseX, uMouseY));
  gl_FragColor = vec4(color, 1.0);
}
`

function AuroraPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const uniforms = useMemo(
    () => ({
      uResolution: { value: [typeof window !== "undefined" ? window.innerWidth : 1920, typeof window !== "undefined" ? window.innerHeight : 1080] },
      uTime: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
      materialRef.current.uniforms.uMouseX.value += (mouseRef.current.x - materialRef.current.uniforms.uMouseX.value) * 0.02
      materialRef.current.uniforms.uMouseY.value += (mouseRef.current.y - materialRef.current.uniforms.uMouseY.value) * 0.02
    }
  })

  return (
      <mesh ref={meshRef} onPointerMove={(e) => { if (e.uv) { mouseRef.current = { x: e.uv.x, y: e.uv.y } } }}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        transparent={false}
      />
    </mesh>
  )
}

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: "#0a0a0a" }}
      >
        <AuroraPlane />
      </Canvas>
    </div>
  )
}
