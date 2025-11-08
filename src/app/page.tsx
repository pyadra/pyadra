"use client"

import Link from 'next/link';
import { useEffect, useRef, useState } from "react"

type Stat = { label: string; target: number; suffix?: string }

export default function Home() {
  const [introHidden, setIntroHidden] = useState(false)

  // --- Canvas neuronal ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // --- Animación de números ---
  const stats: Stat[] = [
    { label: "Projects in Progress", target: 4 },
    { label: "Collaborations Made", target: 6 },
    { label: "Momentum", target: 19, suffix: "%" },
  ]
  const [values, setValues] = useState<number[]>(stats.map(() => 0))

  // --- Ripple en cards ---
  const ripple = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = e.currentTarget
    const ripple = document.createElement("div")
    const rect = el.getBoundingClientRect()
    ripple.style.position = "absolute"
    ripple.style.borderRadius = "50%"
    ripple.style.background =
      "radial-gradient(circle, rgba(41,171,226,0.3) 0%, transparent 70%)"
    ripple.style.width = "300px"
    ripple.style.height = "300px"
    ripple.style.pointerEvents = "none"
    ripple.style.left = `${e.clientX - rect.left - 150}px`
    ripple.style.top = `${e.clientY - rect.top - 150}px`
    ripple.style.animation = "ripple 1s ease-out"
    el.appendChild(ripple)
    setTimeout(() => ripple.remove(), 1000)
  }

  // Intro (3–5s). Puedes ajustar a 3000 si quieres exactamente 3s
  useEffect(() => {
    const t = setTimeout(() => setIntroHidden(true), 5000)
    return () => clearTimeout(t)
  }, [])

  // Canvas + partículas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    type P = { x: number; y: number; vx: number; vy: number; r: number }
    const particles: P[] = []
    const count = 80
    const linkDist = 150

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      })
    }

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // update + draw
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // atracción al mouse
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 200) {
          p.x += dx * 0.001
          p.y += dy * 0.001
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(41,171,226,0.6)"
        ctx.fill()
      }
      // conexiones
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < linkDist) {
            const op = 1 - d / linkDist
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(41,171,226,${op * 0.2})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    document.addEventListener("mousemove", onMove)

    return () => {
      window.removeEventListener("resize", resize)
      document.removeEventListener("mousemove", onMove)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  // Animación de números cuando termina la intro
  useEffect(() => {
    if (!introHidden) return
    const duration = 2000
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setValues(stats.map(s => Math.round(s.target * p)))
      if (p < 1) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introHidden])

  return (
    <div>
      {/* Intro */}
      <div id="intro" className={introHidden ? "hidden" : ""}>
        <div className="awakening-light" />
        <div className="intro-text">PYADRA</div>
        <div className="intro-text">People helping People</div>
      </div>

      {/* Canvas neuronal y orbes */}
      <canvas id="neuralCanvas" ref={canvasRef} />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />

      {/* Main container */}
      <div className="container">
        <header>
          <div className="logo">Pyadra</div>
        </header>

        <section className="hero">
          <h1>
            Becoming better
            <br /> together.
          </h1>
          <p>We create projects, support ideas, and grow together. Honestly.</p>

          <div className="cta-buttons">
            <Link href="/projects" passHref>
            <button className="btn btn-primary">Help Someone Grow</button>
            <button className="btn btn-secondary">Start Your Journey</button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card" onMouseEnter={ripple}>
              <div className="stat-icon">{i === 0 ? "○" : i === 1 ? "◇" : "◈"}</div>
              <div className="stat-number">
                {values[i]}
                {s.suffix ?? ""}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard grid */}
        <div className="dashboard-grid">
          {[
            ["⬡", "Seeds", "Where new ideas take root"],
            ["◆", "Nurture", "Give what helps ideas grow"],
            ["△", "Harvest", "Where shared effort becomes impact"],
            ["◉", "Harvesters", "People who grow together"],
          ].map(([icon, title, sub]) => (
            <div key={title} className="dash-card" onMouseEnter={ripple}>
              <div className="dash-icon">{icon}</div>
              <div className="dash-title">{title}</div>
              <div className="dash-subtitle">{sub}</div>
            </div>
          ))}
        </div>

        {/* Energy flow */}
        <div className="energy-section">
          <div className="energy-title">Collective Energy Flow</div>
          <div className="energy-percentage">82%</div>
          <div className="energy-bar-container">
            <div className="energy-bar-fill" />
          </div>
          <button className="btn btn-primary">Start Something</button>
        </div>
      </div>
    </div>
  )
}
