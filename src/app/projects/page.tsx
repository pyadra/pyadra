"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ===================== Types ===================== */
type Project = {
  id: string;
  name: string;
  summary: string;
  coverUrl: string;
  hasShares: boolean;
  pricePerShare?: number; // AUD
  sharesAvailable?: number;
  minShares?: number;
  supportPercent?: number; // visual only
};

/* ===================== Data (4 projects) ===================== */
const PROJECTS: Project[] = [
  {
    id: "orbit-77",
    name: "Orbit 77 Podcast",
    summary:
      "Short, human-tech conversations that spark creativity and collective impact. A weekly pulse for the mind.",
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80&auto=format&fit=crop",
    hasShares: false,
    supportPercent: 68,
  },
  {
    id: "ebook-mm",
    name: "eBOOK — Unbreakable Millionaire Mindset",
    summary:
      "A practical, human-centered guide to habits, focus, and financial discipline for long-term growth.",
    coverUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop",
    hasShares: true,
    pricePerShare: 5,
    sharesAvailable: 1200,
    minShares: 5,
    supportPercent: 82,
  },
  {
    id: "phd-edu",
    name: "PhD Edu",
    summary:
      "An open academic journey where methods, live notes, and learnings are shared with the collective in real time.",
    coverUrl:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200&q=80&auto=format&fit=crop",
    hasShares: true,
    pricePerShare: 7.5,
    sharesAvailable: 800,
    minShares: 3,
    supportPercent: 9,
  },
  {
    id: "eternicapsule",
    name: "EterniCapsule",
    summary:
      "Memory & legacy capsules: store messages, stories, and lessons for your future selves.",
    coverUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop",
    hasShares: false,
    supportPercent: 59,
  },
];

/* ===================== Neural Background ===================== */
function NeuralBackground() {
  useEffect(() => {
    const canvas = document.getElementById("neural-bg") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      });
    }

    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(41,171,226,0.45)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            const op = 1 - d / 130;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(41,171,226,${op * 0.22})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    step();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas id="neural-bg" className="fixed inset-0 w-full h-full pointer-events-none opacity-25 z-0" />;
}

/* ===================== Coffee Modal (same flow as Home) ===================== */
const CURRENCY = "AUD";
const PRESETS_AUD = [5, 10, 25];
const MIN_AMOUNT_AUD = 2;
const toCents = (d: number) => Math.round(d * 100);

function InviteCoffeeModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [amountAud, setAmountAud] = useState<number | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleStripe() {
    if (!project || !agreed || loading) return;
    const dollars = amountAud === null ? MIN_AMOUNT_AUD : Math.max(MIN_AMOUNT_AUD, amountAud);
    const amount = toCents(dollars);

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "projects-cta",
          amount, // cents AUD
          project_id: project.id,
        }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else throw new Error(data?.error || "Unable to start checkout");
    } catch (e: any) {
      setErrorMsg(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Invite a Coffee"
    >
      <motion.div
        className="relative w-full max-w-md bg-[#0B1D26]/95 border border-[#29ABE2]/30 rounded-2xl p-6"
        style={{ boxShadow: "0 30px 80px rgba(41,171,226,0.3)" }}
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="text-2xl font-semibold mb-1">Invite a Coffee ☕</h3>
        <p className="text-white/70 mb-4">
          Support <span className="text-white font-medium">{project?.name}</span>. Symbolic shares may be issued per project rules. No financial returns.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {PRESETS_AUD.map((d) => (
            <button
              key={d}
              onClick={() => setAmountAud(d)}
              className={`px-3 py-2 rounded-lg border ${
                amountAud === d ? "border-[#29ABE2] text-[#29ABE2]" : "border-white/20 text-white"
              } bg-white/10 hover:bg-white/20 transition`}
            >
              ${d}
            </button>
          ))}
        </div>

        <label className="block text-xs text-white/80 mb-1">Custom amount ({CURRENCY})</label>
        <input
          type="number"
          min={MIN_AMOUNT_AUD}
          value={amountAud === null ? "" : amountAud}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setAmountAud(null);
            else {
              const num = parseFloat(val);
              setAmountAud(num < MIN_AMOUNT_AUD ? MIN_AMOUNT_AUD : num);
            }
          }}
          className="w-full h-11 bg-white/10 border border-white/20 rounded-lg px-3 text-white focus:outline-none focus:border-[#29ABE2] mb-3"
          placeholder={`Enter custom amount in ${CURRENCY}`}
        />

        <label className="flex items-start gap-2 text-xs text-white/70 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10"
          />
          I understand these are symbolic shares, not financial returns.
        </label>

        {errorMsg && <div className="text-red-300 text-xs mb-3">{errorMsg}</div>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={handleStripe}
            disabled={!agreed || loading}
            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] disabled:opacity-50"
            style={{ boxShadow: !agreed || loading ? "none" : "0 0 24px rgba(41,171,226,0.45)" }}
          >
            {loading ? "Redirecting…" : "Contribute with Stripe"}
          </button>
        </div>

        <p className="text-xs text-white/50 mt-4">
          No card data touches Pyadra — Stripe handles payments securely.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ===================== Shares Modal (small screen) ===================== */
function BuySharesModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const min = project.minShares ?? 1;
  const price = project.pricePerShare ?? 0;
  const [quantity, setQuantity] = useState<number>(min);
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  const q = Number.isNaN(quantity) ? 0 : quantity;
  const subtotal = q * price;
  const fees = subtotal * 0.03;
  const total = subtotal + fees;

  const handleBuy = () => {
    if (!agreed || Number.isNaN(quantity) || (quantity as number) < min) return;
    setSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg bg-[#0B1D26]/95 border border-[#29ABE2]/30 rounded-2xl p-6"
        style={{ boxShadow: "0 30px 80px rgba(41,171,226,0.3)" }}
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white" aria-label="Close">
          ✕
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#66FFB2]/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#66FFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold">Purchase Confirmed</h3>
            <p className="text-white/70">You now hold {q} shares in this project.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-1">Buy Shares</h2>
            <p className="text-white/70 mb-5">{project.name}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <InfoBox label="Price per share" value={price ? `$${price.toFixed(2)} AUD` : "—"} />
              <InfoBox label="Available" value={project.sharesAvailable ?? "—"} />
              <InfoBox label="Minimum" value={min} />
            </div>

            <div className="mb-5">
              <label className="block text-sm text-white/80 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => {
                    const n = Number.isNaN(prev) ? min : (prev as number);
                    return Math.max(min, n - 1);
                  })}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <input
                  type="number"
                  min={min}
                  value={Number.isNaN(quantity) ? "" : quantity}
                  onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") setQuantity(null as unknown as number); // permite limpiar el campo
                            else {
                              const num = parseInt(val, 10);
                              setQuantity(num < min ? min : num);
                            }
                          }}
                  className="flex-1 h-10 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-center focus:outline-none focus:border-[#29ABE2]"
                  aria-label="Share quantity"
                />

                <button
                  onClick={() => setQuantity((prev) => {
                    const n = Number.isNaN(prev) ? min : (prev as number);
                    return n + 1;
                  })}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <div className="ml-auto text-sm text-white/70">
                  Total: <span className="font-medium text-white">${total.toFixed(2)} AUD</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-5 space-y-2">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)} AUD`} />
              <Row label="Fees (3%)" value={`$${fees.toFixed(2)} AUD`} />
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#29ABE2]">${total.toFixed(2)} AUD</span>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-5 cursor-pointer text-xs text-white/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10"
              />
              I understand these are project shares subject to Pyadra rules. No financial returns are promised.
            </label>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={!agreed || Number.isNaN(quantity) || (quantity as number) < min}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: agreed && !Number.isNaN(quantity) && (quantity as number) >= min ? "0 0 30px rgba(41,171,226,0.5)" : "none" }}
              >
                Buy Shares
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function InfoBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-xs text-white/60 mb-1">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-white/60">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

/* ===================== Project Details Modal ===================== */
function ProjectDetailsModal({
  project,
  onClose,
  onInviteCoffee,
  onBuyShares,
}: {
  project: Project;
  onClose: () => void;
  onInviteCoffee: (p: Project) => void;
  onBuyShares: (p: Project) => void;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-3xl bg-[#0B1D26]/95 border border-[#29ABE2]/30 rounded-2xl overflow-hidden my-8"
        style={{ boxShadow: "0 30px 80px rgba(41,171,226,0.3)" }}
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white/60 hover:text-white" aria-label="Close modal">
          ✕
        </button>

        <div className="relative h-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.coverUrl} alt={project.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26] to-transparent" />
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-semibold mb-4">{project.name}</h2>
          <p className="text-white/80 mb-8 leading-relaxed">{project.summary}</p>

          {typeof project.supportPercent === "number" && (
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Collective Progress</h3>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Support</span>
                  <span className="text-[#29ABE2] font-semibold">{project.supportPercent}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#29ABE2] to-[#00E0C7]" style={{ width: `${project.supportPercent}%` }} />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onInviteCoffee(project)}
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
            >
              Invite a Coffee ☕
            </button>

            {project.hasShares ? (
              <button
                onClick={() => onBuyShares(project)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] rounded-lg"
                style={{ boxShadow: "0 0 30px rgba(41,171,226,0.5)" }}
              >
                Buy Shares
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===================== Cards (Unified) ===================== */
function ProjectCard({
  project,
  onInviteCoffee,
  onBuyShares,
  onViewDetails,
}: {
  project: Project;
  onInviteCoffee: (p: Project) => void;
  onBuyShares: (p: Project) => void;
  onViewDetails: (p: Project) => void;
}) {
  return (
    <motion.div
      className="group relative bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-[#29ABE2]/50 hover:-translate-y-2"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
      whileHover={{ boxShadow: "0 22px 60px rgba(41,171,226,0.2)" }}
    >
      <div
        role="button"
        aria-label={`View details of ${project.name}`}
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(project)}
      >
        <img
          src={project.coverUrl}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26] via-transparent to-transparent" />
        {project.hasShares && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-[#29ABE2]/90 backdrop-blur-sm rounded-full text-xs font-semibold">
            Shares Available
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{project.name}</h3>
        <p className="text-sm text-white/70 mb-4 line-clamp-2">{project.summary}</p>

        {typeof project.supportPercent === "number" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/60">Support progress</span>
              <span className="text-xs font-semibold text-[#29ABE2]">{project.supportPercent}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.supportPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onInviteCoffee(project)}
            className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20"
            aria-label={`Invite a Coffee for ${project.name}`}
          >
            Invite a Coffee ☕
          </button>

          {project.hasShares ? (
            <button
              onClick={() => onBuyShares(project)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              style={{ boxShadow: "0 0 20px rgba(41,171,226,0.35)" }}
              aria-label={`Buy shares in ${project.name}`}
            >
              Buy Shares
            </button>
          ) : (
            <button
              onClick={() => onViewDetails(project)}
              className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20"
              aria-label={`View details of ${project.name}`}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ===================== Page ===================== */
export default function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [coffeeFor, setCoffeeFor] = useState<Project | null>(null);
  const [buySharesFor, setBuySharesFor] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1D26] text-white relative overflow-x-hidden">
      <NeuralBackground />

      {/* Header with Pyadra wordmark → Home */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-2 flex items-center">
        <Link href="/" className="text-white/90 hover:text-white font-semibold tracking-wide" aria-label="Go to Home">
          Pyadra
        </Link>
      </header>

      

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Projects</h1>
            <p className="text-white/70">Real people, real projects — growing together.</p>
          </div>
        </div>

        {/* Grid (4 projects) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onInviteCoffee={() => setCoffeeFor(p)}
              onBuyShares={() => setBuySharesFor(p)}
              onViewDetails={() => setSelected(p)}
            />
          ))}
        </section>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {coffeeFor && <InviteCoffeeModal project={coffeeFor} onClose={() => setCoffeeFor(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {buySharesFor && buySharesFor.hasShares && <BuySharesModal project={buySharesFor} onClose={() => setBuySharesFor(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <ProjectDetailsModal
            project={selected}
            onClose={() => setSelected(null)}
            onInviteCoffee={(p) => {
              setSelected(null);
              setCoffeeFor(p);
            }}
            onBuyShares={(p) => {
              setSelected(null);
              setBuySharesFor(p);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}