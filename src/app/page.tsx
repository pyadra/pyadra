"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* =========================================
   Types & Consts
========================================= */
type Stat = { label: string; target: number; suffix?: string };

const CURRENCY = "AUD";
const PRESETS_AUD = [5, 10, 25];       // dólares AUD
const MIN_AMOUNT_AUD = 2;              // mínimo $2
const toCents = (dollars: number) => Math.round(dollars * 100);

/* =========================================
   Page
========================================= */
export default function Home() {
  const [introHidden, setIntroHidden] = useState(false);

  // -------- Stripe Modal State --------
  const [openStripeCard, setOpenStripeCard] = useState(false);
  const [amountAud, setAmountAud] = useState<number | null>(null); // AUD dólares; null cuando el input está vacío
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Crear sesión de Stripe (el servidor valida y usa AUD)
  async function handleConfirmContribution() {
    if (!agreed || loading) return;
    const dollars = Math.max(MIN_AMOUNT_AUD, amountAud ?? MIN_AMOUNT_AUD);
    const amountCents = toCents(dollars);

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "home-cta",
          amount: amountCents,         // centavos AUD
          project_id: "collective-fund",
          currency: "AUD",
        }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else throw new Error(data?.error || "Unable to start checkout");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // -------- Neural Canvas (fondo) --------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const stats: Stat[] = [
    { label: "Projects in Progress", target: 4 },
    { label: "Collaborations Made", target: 6 },
    { label: "Momentum", target: 19, suffix: "%" },
  ];
  const [values, setValues] = useState<number[]>(stats.map(() => 0));

  const ripple = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = e.currentTarget;
    const ripple = document.createElement("div");
    const rect = el.getBoundingClientRect();
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "radial-gradient(circle, rgba(41,171,226,0.3) 0%, transparent 70%)";
    ripple.style.width = "300px";
    ripple.style.height = "300px";
    ripple.style.pointerEvents = "none";
    ripple.style.left = `${e.clientX - rect.left - 150}px`;
    ripple.style.top = `${e.clientY - rect.top - 150}px`;
    ripple.style.animation = "ripple 1s ease-out";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  };

  useEffect(() => {
    const t = setTimeout(() => setIntroHidden(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const particles: P[] = [];
    const count = 80;
    const linkDist = 150;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      });
    }

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200) {
          p.x += dx * 0.001;
          p.y += dy * 0.001;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(41,171,226,0.6)";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const op = 1 - d / linkDist;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(41,171,226,${op * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    if (!introHidden) return;
    const duration = 2000;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setValues(stats.map((s) => Math.round(s.target * p)));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introHidden]);

  /* =========================================
     Render
  ========================================= */
  const isValidAmount = (amountAud ?? 0) >= MIN_AMOUNT_AUD;

  return (
    <div>
      {/* Intro */}
      <div id="intro" className={introHidden ? "hidden" : ""}>
        <div className="awakening-light" />
        <div className="intro-text">PYADRA</div>
        <div className="intro-text">People helping People</div>
      </div>

      {/* Neural Canvas */}
      <canvas id="neuralCanvas" ref={canvasRef} />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />

      {/* Main */}
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
            <button
              className="btn btn-primary"
              onClick={() => setOpenStripeCard(true)}
              aria-haspopup="dialog"
            >
              Invite a Coffee
            </button>

            <Link href="/projects" passHref>
              <button className="btn btn-secondary">Sync with Pyadra</button>
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

        {/* Dashboard */}
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
          <Link href="/collective" passHref>
            <button className="btn btn-primary">collective</button>
          </Link>
        </div>
      </div>

      {/* ========= Modal Neural (Stripe) ========= */}
      {openStripeCard && (
        <div
          id="neural-confirm-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="neural-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenStripeCard(false)}
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(11,29,38,0.95)",
              borderRadius: "16px",
              border: "1px solid rgba(41,171,226,0.3)",
              padding: "24px",
              boxShadow: "0 30px 80px rgba(41,171,226,0.35)",
            }}
          >
            <button
              onClick={() => setOpenStripeCard(false)}
              aria-label="Close"
              className="absolute top-3 right-3"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              ✕
            </button>

            <h3 id="neural-title" className="text-2xl font-semibold" style={{ color: "#F4F6F8" }}>
              Confirm Contribution
            </h3>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, marginBottom: 16 }}>
              Support the collective fund — symbolic shares will be issued once payment completes.
            </p>

            {/* Presets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
              {PRESETS_AUD.map((dollars) => (
                <button
                  key={dollars}
                  onClick={() => setAmountAud(dollars)}
                  style={{
                    padding: "10px 0",
                    borderRadius: 10,
                    border:
                      amountAud === dollars
                        ? "1px solid #29ABE2"
                        : "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: amountAud === dollars ? "#29ABE2" : "#F4F6F8",
                    fontWeight: 600,
                  }}
                >
                  ${dollars}
                </button>
              ))}
            </div>

            {/* Custom amount (AUD) — permite borrar/escribir libremente */}
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
              Custom amount ({CURRENCY})
            </label>
            <input
              type="number"
              min={MIN_AMOUNT_AUD}
              value={amountAud === null ? "" : amountAud}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setAmountAud(null); // limpiar
                } else {
                  const num = parseFloat(val);
                  setAmountAud(Number.isFinite(num) ? Math.max(MIN_AMOUNT_AUD, num) : MIN_AMOUNT_AUD);
                }
              }}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#29ABE2]"
              placeholder={`Enter custom amount in ${CURRENCY}`}
              aria-label={`Contribution amount in ${CURRENCY}`}
              style={{ marginBottom: 14 }}
            />

            <label
              style={{
                display: "flex",
                gap: 10,
                fontSize: 12,
                color: "rgba(255,255,255,0.75)",
                marginBottom: 14,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                aria-label="Agree to symbolic shares notice"
              />
              I understand these are symbolic shares, not financial returns.
            </label>

            {errorMsg && (
              <div style={{ color: "#FFB4B4", fontSize: 12, marginBottom: 8 }}>{errorMsg}</div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={() => setOpenStripeCard(false)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#F4F6F8",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmContribution}
                disabled={!agreed || !isValidAmount || loading}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "linear-gradient(90deg,#29ABE2 0%, #00E0C7 100%)",
                  color: "#0B1D26",
                  fontWeight: 600,
                  opacity: !agreed || !isValidAmount || loading ? 0.6 : 1,
                  boxShadow: !agreed || !isValidAmount || loading ? "none" : "0 0 24px rgba(41,171,226,0.45)",
                }}
                aria-busy={loading}
              >
                {loading ? "Redirecting…" : "Contribute with Stripe"}
              </button>
            </div>

            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 12 }}>
              No card data touches Pyadra — Stripe handles all transactions securely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}