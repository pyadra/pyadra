"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** ===================== Types ===================== */
type Creator = { name: string; avatarUrl?: string };
type Project = {
  id: string;
  name: string;
  creator: Creator;
  coverUrl?: string;
  summary: string;
  supportPercent: number; // 0-100
  supporters: number;
  collaborations: number;
  milestones: number;
  pricePerShare?: number;
  sharesAvailable?: number;
  minShares?: number;
  hasShares: boolean;
  tags?: string[];
};

/** ===================== Mock Data ===================== */
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Solar Community Hub",
    creator: { name: "Maria Santos", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    coverUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    summary: "Building sustainable energy solutions for rural communities",
    supportPercent: 87,
    supporters: 234,
    collaborations: 45,
    milestones: 12,
    pricePerShare: 5.0,
    sharesAvailable: 1200,
    minShares: 10,
    hasShares: true,
    tags: ["energy", "sustainability"],
  },
  {
    id: "2",
    name: "Urban Garden Network",
    creator: { name: "Alex Chen", avatarUrl: "https://i.pravatar.cc/150?img=2" },
    coverUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
    summary: "Connecting neighbors through shared urban farming spaces",
    supportPercent: 64,
    supporters: 156,
    collaborations: 28,
    milestones: 8,
    hasShares: false,
    tags: ["community", "food"],
  },
  {
    id: "3",
    name: "Code for Kids",
    creator: { name: "Jordan Lee", avatarUrl: "https://i.pravatar.cc/150?img=3" },
    coverUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    summary: "Free coding education for underserved youth",
    supportPercent: 92,
    supporters: 412,
    collaborations: 67,
    milestones: 15,
    pricePerShare: 3.5,
    sharesAvailable: 2000,
    minShares: 5,
    hasShares: true,
    tags: ["education", "technology"],
  },
  {
    id: "4",
    name: "Clean Ocean Initiative",
    creator: { name: "Emma Rivera", avatarUrl: "https://i.pravatar.cc/150?img=4" },
    coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    summary: "Organizing coastal cleanups and marine conservation",
    supportPercent: 78,
    supporters: 298,
    collaborations: 52,
    milestones: 10,
    pricePerShare: 10.0,
    sharesAvailable: 500,
    minShares: 20,
    hasShares: true,
    tags: ["environment", "ocean"],
  },
  {
    id: "5",
    name: "Mental Health Circles",
    creator: { name: "Sam Taylor", avatarUrl: "https://i.pravatar.cc/150?img=5" },
    coverUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
    summary: "Peer support groups for mental wellness",
    supportPercent: 45,
    supporters: 89,
    collaborations: 15,
    milestones: 5,
    hasShares: false,
    tags: ["health", "community"],
  },
  {
    id: "6",
    name: "Refugee Skills Academy",
    creator: { name: "Amir Hassan", avatarUrl: "https://i.pravatar.cc/150?img=6" },
    coverUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    summary: "Vocational training and job placement for refugees",
    supportPercent: 71,
    supporters: 187,
    collaborations: 34,
    milestones: 9,
    pricePerShare: 7.5,
    sharesAvailable: 800,
    minShares: 15,
    hasShares: true,
    tags: ["education", "social"],
  },
  {
    id: "7",
    name: "Local Food Co-op",
    creator: { name: "Lisa Wong", avatarUrl: "https://i.pravatar.cc/150?img=7" },
    coverUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
    summary: "Community-owned marketplace for local farmers",
    supportPercent: 58,
    supporters: 143,
    collaborations: 21,
    milestones: 7,
    hasShares: false,
    tags: ["food", "economy"],
  },
  {
    id: "8",
    name: "Accessible Tech Lab",
    creator: { name: "Dev Patel", avatarUrl: "https://i.pravatar.cc/150?img=8" },
    coverUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    summary: "Creating assistive technology for people with disabilities",
    supportPercent: 83,
    supporters: 267,
    collaborations: 41,
    milestones: 11,
    pricePerShare: 6.0,
    sharesAvailable: 1500,
    minShares: 10,
    hasShares: true,
    tags: ["technology", "accessibility"],
  },
];

const FILTER_TABS = ["All", "New", "Most Supported", "Most Collaborated", "Near Launch", "Has Shares"] as const;
const SORT_OPTIONS = ["Trending", "Newest", "Funding", "Collaboration"] as const;

/** ===================== Background ===================== */
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

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(41, 171, 226, 0.4)";
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(41, 171, 226, ${0.2 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    };
    animate();

    const handleResize = () => setSize();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas id="neural-bg" className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-25 z-0" />;
}

/** ===================== Cards & Modals ===================== */
function ProjectCard({
  project,
  onSupport,
  onJoin,
  onBuyShares,
  onViewDetails,
}: {
  project: Project;
  onSupport: (p: Project) => void;
  onJoin: (p: Project) => void;
  onBuyShares: (p: Project) => void;
  onViewDetails: (p: Project) => void;
}) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <motion.div
      className="group relative bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-[#29ABE2]/50 hover:-translate-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
      whileHover={{ boxShadow: "0 20px 60px rgba(41, 171, 226, 0.2)" }}
    >
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onViewDetails(project)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.coverUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26] via-transparent to-transparent" />
        {project.hasShares && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-[#29ABE2]/90 backdrop-blur-sm rounded-full text-xs font-semibold">Shares Available</div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.creator.avatarUrl} alt={project.creator.name} className="w-10 h-10 rounded-full border-2 border-[#29ABE2]/30" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate mb-0.5">{project.name}</h3>
            <p className="text-sm text-white/60">{project.creator.name}</p>
          </div>
        </div>

        <p className="text-sm text-white/70 mb-4 line-clamp-2">{project.summary}</p>

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

        <div className="flex items-center gap-3 mb-4 text-xs text-white/60">
          <span>{project.supporters} Supporters</span>
          <span>·</span>
          <span>{project.collaborations} Collaborations</span>
          <span>·</span>
          <span>{project.milestones} Milestones</span>
        </div>

        <div className="space-y-2">
          {project.hasShares ? (
            <button
              onClick={() => onBuyShares(project)}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              style={{ boxShadow: "0 0 20px rgba(41, 171, 226, 0.3)" }}
              aria-label={`Buy shares in ${project.name}`}
            >
              Buy Shares
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSupport(project)}
                className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg transition-all duration-300 hover:bg白/20"
                aria-label={`Support ${project.name}`}
              >
                Support
              </button>
              <button
                onClick={() => onJoin(project)}
                className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20"
                aria-label={`Join ${project.name}`}
              >
                Join
              </button>
            </div>
          )}
          <button
            onClick={() => setIsFollowing((v) => !v)}
            className={`w-full px-4 py-2 border ${
              isFollowing ? "border-[#29ABE2] text-[#29ABE2]" : "border-white/20 text-white/60"
            } font-medium rounded-lg transition-all duration-300 hover:border-[#29ABE2] hover:text-[#29ABE2]`}
            aria-label={isFollowing ? `Unfollow ${project.name}` : `Follow ${project.name}`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function BuySharesModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const min = project.minShares ?? 1;
  const price = project.pricePerShare ?? 0;
  const [quantity, setQuantity] = useState<number>(min);
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = quantity * price;
  const fees = subtotal * 0.03;
  const total = subtotal + fees;

  const handleBuy = () => {
    if (!agreed || quantity < min) return;
    setSuccess(true);
    setTimeout(() => onClose(), 1600);
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
        className="relative w-full max-w-lg bg-[#0B1D26]/95 backdrop-blur-[40px] border border-[#29ABE2]/30 rounded-2xl p-8"
        style={{ boxShadow: "0 30px 80px rgba(41, 171, 226, 0.3)" }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white" aria-label="Close modal">
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
            <p className="text-white/70">You now hold {quantity} shares in this project.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Buy Shares</h2>
            <p className="text-white/60 mb-6">{project.name}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <InfoBox label="Price per share" value={price ? `$${price.toFixed(2)}` : "—"} />
              <InfoBox label="Available" value={project.sharesAvailable ?? "—"} />
              <InfoBox label="Minimum" value={min} />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white/80 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(min, q - 1))}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min={min}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(min, Number(e.target.value) || min))}
                  className="flex-1 h-10 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-center focus:outline-none focus:border-[#29ABE2]"
                  aria-label="Share quantity"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <div className="ml-auto text-sm text-white/70">
                  Total: <span className="font-medium text-white">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6 space-y-2">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Fees (3%)" value={`$${fees.toFixed(2)}`} />
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#29ABE2]">${total.toFixed(2)}</span>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer text-xs text-white/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10"
                aria-label="Agree to terms"
              />
              I understand these are project shares subject to Pyadra rules. No financial returns are promised. Read project rules.
            </label>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={!agreed || quantity < min}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: agreed && quantity >= min ? "0 0 30px rgba(41, 171, 226, 0.5)" : "none" }}
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

function ProjectModal({
  project,
  onClose,
  onBuyShares,
}: {
  project: Project;
  onClose: () => void;
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
        className="relative w-full max-w-3xl bg-[#0B1D26]/95 backdrop-blur-[40px] border border-[#29ABE2]/30 rounded-2xl overflow-hidden my-8"
        style={{ boxShadow: "0 30px 80px rgba(41, 171, 226, 0.3)" }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
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

          <div className="flex items-center gap-3 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.creator.avatarUrl} alt={project.creator.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-medium">{project.creator.name}</div>
              <div className="text-sm text-white/60">Project Creator</div>
            </div>
          </div>

          <p className="text-white/80 mb-8 leading-relaxed">{project.summary}</p>

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Collective Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Support</span>
                  <span className="text-[#29ABE2] font-semibold">{project.supportPercent}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#29ABE2] to-[#00E0C7]" style={{ width: `${project.supportPercent}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold">{project.supporters}</div>
                  <div className="text-xs text-white/60">Supporters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{project.collaborations}</div>
                  <div className="text-xs text-white/60">Collaborations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{project.milestones}</div>
                  <div className="text-xs text-white/60">Milestones</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {project.hasShares && (
              <button
                onClick={() => {
                  onClose();
                  onBuyShares(project);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] rounded-lg"
                style={{ boxShadow: "0 0 30px rgba(41, 171, 226, 0.5)" }}
              >
                Buy Shares
              </button>
            )}
            <button className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">Support</button>
            <button className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">Join</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** ===================== Page ===================== */
export default function ProjectsPage() {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]>("All");
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>("Trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [buySharesProject, setBuySharesProject] = useState<Project | null>(null);

  const filteredProjects = projects
    .filter((project) => {
      if (activeFilter === "Has Shares") return project.hasShares;
      if (activeFilter === "Near Launch") return project.supportPercent >= 80;
      if (activeFilter === "Most Supported") return project.supporters > 200;
      if (activeFilter === "Most Collaborated") return project.collaborations > 40;
      return true;
    })
    .filter((p) => (searchQuery ? (p.name + p.summary).toLowerCase().includes(searchQuery.toLowerCase()) : true))
    .sort((a, b) => {
      if (sortBy === "Newest") return b.id.localeCompare(a.id);
      if (sortBy === "Funding") return (b.supportPercent ?? 0) - (a.supportPercent ?? 0);
      if (sortBy === "Collaboration") return b.collaborations - a.collaborations;
      return 0; // Trending (placeholder)
    });

  return (
    <div className="min-h-screen bg-[#0B1D26] text-white relative overflow-x-hidden">
      <NeuralBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-5xl font-bold mb-3">Projects</h1>
            <p className="text-lg text-white/70">Real people, real projects, growing together.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] text-white font-semibold rounded-lg transition-all whitespace-nowrap" style={{ boxShadow: "0 0 20px rgba(41, 171, 226, 0.4)" }}>
              Start Something
            </button>
            <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 whitespace-nowrap">Join the Flow</button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTER_TABS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter ? "bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#29ABE2]"
              aria-label="Search projects"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#29ABE2]"
              aria-label="Sort projects"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#0B1D26]">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSupport={(p) => console.log("Support:", p)}
                  onJoin={(p) => console.log("Join:", p)}
                  onBuyShares={setBuySharesProject}
                  onViewDetails={setSelectedProject}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <button className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">Load More Projects</button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onBuyShares={setBuySharesProject} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {buySharesProject && <BuySharesModal project={buySharesProject} onClose={() => setBuySharesProject(null)} />}
      </AnimatePresence>
    </div>
  );
}

/** ===================== Subcomponents ===================== */
function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
      <p className="text-white/60 mb-6">Be the first to start something.</p>
      <button className="px-6 py-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] rounded-lg" style={{ boxShadow: "0 0 20px rgba(41, 171, 226, 0.4)" }}>
        Start Something
      </button>
    </div>
  );
}
