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

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 1);

    const vertSrc = [
      'attribute vec2 a_pos;',
      'void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'
    ].join('\n');

    const fragSrc = [
      'precision highp float;',
      'uniform float u_time;',
      'uniform vec2 u_res;',
      'uniform float u_glowIntensity;',
      'uniform float u_waveSpeed;',
      'uniform vec2 u_mouse;',
      '',
      'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
      '',
      'float noise(vec2 p) {',
      '  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.-2.*f);',
      '  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);',
      '}',
      '',
      'float fbm(vec2 p) {',
      '  float v=0.,a=.5;',
      '  for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.49;}',
      '  return v;',
      '}',
      '',
      'float warped(vec2 p, float t) {',
      '  vec2 q = vec2(fbm(p+vec2(0,0)+t*.04), fbm(p+vec2(5.2,1.3)+t*.03));',
      '  vec2 r = vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*.05), fbm(p+3.*q+vec2(8.3,2.8)+t*.04));',
      '  return fbm(p+2.5*r);',
      '}',
      '',
      'void main() {',
      '  vec2 uv = gl_FragCoord.xy/u_res;',
      '  float a = u_res.x/u_res.y;',
      '  vec2 uva = vec2(uv.x*a, uv.y);',
      '  float t = u_time*u_waveSpeed;',
      '',
      '  vec3 col = vec3(.025,.018,.005);',
      '',
      '  float w1 = warped(uva*3.+t*.06, t*.5);',
      '  float w2 = warped(uva*5.-t*.05, t*.4);',
      '  float bio = (w1*.6+w2*.4)*u_glowIntensity;',
      '',
      '  if (u_mouse.x>0.) {',
      '    vec2 mu = u_mouse/u_res;',
      '    vec2 ma = vec2(mu.x*a, mu.y);',
      '    float md = length(uva-ma);',
      '    bio += exp(-md*md*8.)*1.5*u_glowIntensity;',
      '  }',
      '',
      '  bio = pow(max(bio,0.), 1.2);',
      '',
      '  vec3 c1 = vec3(.7,.35,.05);',
      '  vec3 c2 = vec3(1.,.5,.3);',
      '  vec3 c3 = vec3(1.,.7,.4);',
      '  vec3 bc = mix(c1,c2,noise(uva*2.+t*.02));',
      '  bc = mix(bc,c3,smoothstep(.4,.8,bio));',
      '  col += bc*bio;',
      '',
      '  float sp = 0.;',
      '  for(int i=0;i<8;i++){',
      '    float fi=float(i);',
      '    vec2 p = vec2(hash(vec2(fi*17.3,fi*11.9)));',
      '    p.x = fract(p.x+t*(.01+hash(vec2(fi*5.1,fi*3.7))*.02));',
      '    p.y = fract(p.y+sin(t*.3+fi)*.02);',
      '    float d = length(uv-p);',
      '    sp += smoothstep(.004+hash(vec2(fi*3.7,fi*2.3))*.004, 0., d)*sin(t*(1.+hash(vec2(fi*2.3,fi*7.)))+fi*7.)*.5+.5;',
      '  }',
      '  col += vec3(1.,.7,.5)*sp*.3*u_glowIntensity;',
      '',
      '  col = max(col,0.);',
      '  col = pow(col, vec3(.9));',
      '  col *= 1.4;',
      '',
      '  gl_FragColor = vec4(col, 1.);',
      '}'
    ].join('\n');

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uGlowIntensity = gl.getUniformLocation(prog, 'u_glowIntensity');
    const uWaveSpeed = gl.getUniformLocation(prog, 'u_waveSpeed');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouseXVal = -1.0, mouseYVal = -1.0;
    const glowIntensityVal = 1.2;
    const waveSpeedVal = 0.8;
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
      gl!.uniform1f(uGlowIntensity, glowIntensityVal);
      gl!.uniform1f(uWaveSpeed, waveSpeedVal);
      gl!.uniform2f(uMouse, mouseXVal, mouseYVal);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    }

    const handleResize = () => {
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      }
    };
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      mouseXVal = e.clientX * dpr;
      mouseYVal = (canvas!.clientHeight - e.clientY) * dpr;
    };
    const handleMouseLeave = () => { mouseXVal = -1.0; mouseYVal = -1.0; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
