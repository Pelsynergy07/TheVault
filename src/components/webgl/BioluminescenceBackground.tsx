"use client";

import { useEffect, useRef } from 'react';

export function BioluminescenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' })
      || canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    if (!gl) return;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    const isIntegrated = /intel|amd.*(rak|ston)|apple (m|a\d)/i.test(renderer) || /mesa|llvmpipe|swiftshader|software/i.test(renderer);
    if (isIntegrated) {
      console.warn('FluidAmber: Running on integrated GPU. For best performance, set Chrome to use your dedicated GPU in NVIDIA/AMD Control Panel.');
    }

    const dpr = isIntegrated ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5);

    const vertSrc = [
      'attribute vec2 a_pos;',
      'void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'
    ].join('\n');

    const fragSrc = [
      'precision highp float;',
      'uniform float u_time;',
      'uniform vec2 u_res;',
      '',
      'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
      'vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
      'vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }',
      '',
      'float snoise(vec2 v) {',
      '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
      '  vec2 i = floor(v + dot(v, C.yy));',
      '  vec2 x0 = v - i + dot(i, C.xx);',
      '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
      '  vec4 x12 = x0.xyxy + C.xxzz;',
      '  x12.xy -= i1;',
      '  i = mod289v2(i);',
      '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
      '  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);',
      '  m = m * m; m = m * m;',
      '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
      '  vec3 h = abs(x) - 0.5;',
      '  vec3 ox = floor(x + 0.5);',
      '  vec3 a0 = x - ox;',
      '  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);',
      '  vec3 g;',
      '  g.x = a0.x * x0.x + h.x * x0.y;',
      '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
      '  return 130.0 * dot(m, g);',
      '}',
      '',
      'float fbm(vec2 p, float t) {',
      '  float val = 0.0, amp = 0.5, freq = 1.0;',
      '  for (int i = 0; i < 5; i++) {',
      '    val += amp * snoise(p * freq + t * 0.3);',
      '    freq *= 2.1; amp *= 0.48; p += vec2(1.7, 9.2);',
      '  }',
      '  return val;',
      '}',
      '',
      'void main() {',
      '  vec2 uv = gl_FragCoord.xy / u_res;',
      '  vec2 p = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);',
      '  float t = u_time * 0.15;',
      '',
      '  vec2 q = vec2(fbm(p + vec2(0.0, 0.0), t), fbm(p + vec2(5.2, 1.3), t));',
      '  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2), t * 1.2), fbm(p + 4.0 * q + vec2(8.3, 2.8), t * 1.2));',
      '  float f = fbm(p + 3.5 * r, t * 0.8);',
      '',
      '  vec3 col = mix(vec3(0.075, 0.065, 0.055), vec3(0.20, 0.14, 0.07), clamp(f * f * 2.0, 0.0, 1.0));',
      '  col = mix(col, vec3(0.78, 0.58, 0.24), clamp(length(q) * 0.5, 0.0, 1.0));',
      '  col = mix(col, vec3(0.95, 0.75, 0.35), clamp(length(r.x) * 0.6, 0.0, 1.0));',
      '  float highlight = smoothstep(0.5, 1.2, f * f * 3.0 + length(r) * 0.5);',
      '  col += vec3(0.18, 0.12, 0.04) * highlight;',
      '  col = pow(col, vec3(1.1));',
      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n');

    function compile(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('FluidAmber shader compile error:', gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    const vShader = compile(gl.VERTEX_SHADER, vertSrc);
    const fShader = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vShader || !fShader) return;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('FluidAmber program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;

    function render(now: number) {
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      }
      gl!.uniform1f(uTime, prefersReduced ? 0.0 : now * 0.001);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block w-screen h-screen z-0 pointer-events-none"
    />
  );
}
