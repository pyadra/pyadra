'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — THE STORE · the museum shop                               */
/*                                                                     */
/*  Per Company_Master §8: the Store is NOT a project and NOT part     */
/*  of any exhibition. It is Pyadra's own native space — the museum    */
/*  gift shop. Browse, take something home, done.                      */
/*                                                                     */
/*  PUBLISHING: add/edit objects in the PRODUCTS array below.          */
/*  Digital first (books) — shirts, pens, prints can join later.       */
/*  No generic e-commerce language: "take it home", never "buy now".  */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'eadiaz96@gmail.com';

const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };
const pop = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-70px' },
  transition: SPRING,
};

type Product = {
  id: string;
  kind: string;
  status: 'available' | 'making';
  title: string;
  subtitle: string;
  desc: string;
  price: string;
  /* cover styling — gradient face + spine tint */
  face: string;
  spine: string;
  ink: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'book-i',
    kind: 'Digital book',
    status: 'making',
    title: 'The Path of the Pawn',
    subtitle: 'A life, told as a tale',
    desc: 'Eduardo’s story — leaving home, landing in Australia with nothing, building from zero — written not as it happened, but as it felt: a fable about a pawn crossing the board.',
    price: 'Price on release',
    face: 'linear-gradient(155deg, #0E7A57 0%, #059669 45%, #047857 100%)',
    spine: '#03543F',
    ink: '#EDEFED',
  },
  {
    id: 'book-ii',
    kind: 'Digital book',
    status: 'making',
    title: 'Tales from the Back Seat',
    subtitle: 'Mystery from the Uber night shift',
    desc: 'Real stories passengers tell at 2am — strange, dark, hard to explain — collected one ride at a time and retold as short mystery tales. Some of them still keep the driver awake.',
    price: 'Price on release',
    face: 'linear-gradient(155deg, #232623 0%, #1A1C1A 50%, #0A120E 100%)',
    spine: '#050A07',
    ink: '#EDEFED',
  },
];

const LATER = ['T-shirts', 'Prints', 'Pens', 'Collector editions', 'Audio tales'];

/* ---------- pieces ---------- */

function PillButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 17 }}
      className={`inline-block rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight ${
        primary
          ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/25'
          : 'bg-white text-[#1A1C1A] ring-1 ring-[#1A1C1A]/10 shadow-sm'
      }`}
    >
      {children}
    </motion.a>
  );
}

/* A physical book — tilts with the cursor, floats while it waits. */
function BookCover({ product }: { product: Product }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 });

  return (
    <div
      className="relative flex justify-center"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 250, damping: 16 }}
          className="relative w-44 h-64 md:w-52 md:h-[19rem]"
        >
          {/* spine */}
          <div
            className="absolute left-0 top-0 bottom-0 w-3 rounded-l-md"
            style={{ background: product.spine }}
          />
          {/* cover face */}
          <div
            className="absolute inset-0 ml-3 rounded-r-xl rounded-l-sm shadow-[0_30px_50px_-18px_rgba(10,18,14,0.5)] flex flex-col justify-between p-5 overflow-hidden"
            style={{ background: product.face, color: product.ink }}
          >
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, rgba(255,255,255,0.14) 0%, transparent 28%)' }} />
            <span className="relative text-[9px] font-bold uppercase tracking-[0.25em] opacity-70">Pyadra</span>
            <div className="relative">
              <h3 className="font-serif italic text-2xl md:text-[1.6rem] leading-tight mb-2">{product.title}</h3>
              <p className="text-[11px] font-semibold opacity-70">{product.subtitle}</p>
            </div>
            <span className="relative text-[9px] font-semibold uppercase tracking-[0.2em] opacity-50">
              {product.kind}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const available = product.status === 'available';

  return (
    <motion.div
      {...pop}
      transition={{ ...SPRING, delay: index * 0.1 }}
      className="rounded-[36px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-10 md:gap-12 items-center"
    >
      <BookCover product={product} />

      <div>
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="rounded-full bg-[#EDEFED] text-[#3A4A3E] px-3 py-1.5 text-[11px] font-semibold">
            {product.kind}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
              available ? 'bg-[#059669]/10 text-[#047857]' : 'bg-[#1A1C1A]/5 text-[#6B8070]'
            }`}
          >
            {available && <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />}
            {available ? 'Available now' : 'In the making'}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-1.5">{product.title}</h2>
        <p className="text-[15px] font-semibold text-[#059669] mb-4">{product.subtitle}</p>
        <p className="text-[15px] text-[#3A4A3E] leading-relaxed max-w-md mb-8">{product.desc}</p>

        <div className="flex items-center gap-4 flex-wrap">
          {available ? (
            <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Pyadra%20Store%20%E2%80%94%20${encodeURIComponent(product.title)}`} primary>
              Take it home — {product.price}
            </PillButton>
          ) : (
            <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Pyadra%20Store%20%E2%80%94%20Reserve%3A%20${encodeURIComponent(product.title)}`} primary>
              Reserve your copy →
            </PillButton>
          )}
          <span className="text-[13px] font-medium text-[#6B8070]">
            {available ? 'Delivered to your email' : 'You’ll be the first to know when it’s released'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- the shop ---------- */

export default function PyadraStore() {
  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] font-sans overflow-x-clip antialiased selection:bg-[#059669] selection:text-white min-h-screen">

      {/* floating pill nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, ...SPRING }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-5 pr-1.5 py-1.5">
          <Link href="/" aria-label="Pyadra · Home" className="flex items-center gap-2 mr-2 group">
            <PyadraLogo size={22} />
            <span className="text-sm font-bold tracking-tight transition-colors group-hover:text-[#059669]">
              Pyadra
            </span>
          </Link>
          <Link href="/exhibitions/galaxy" className="hidden sm:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors">
            ← Galaxy
          </Link>
          <span className="rounded-full bg-[#EDEFED] px-3.5 py-2 text-[13px] font-semibold text-[#1A1C1A]">
            The Store
          </span>
        </div>
      </motion.nav>

      {/* ============ ENTRY ============ */}
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[640px] h-[640px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.09), transparent 65%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: ENTER + 0.1, ...SPRING }}
            className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 text-[12px] font-semibold mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            The museum shop
          </motion.span>

          <h1 className="text-4xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.08] md:leading-[1.0] mb-7">
            {['Take something', 'home.'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: ENTER + 0.2 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
                >
                  {i === 1 ? <span className="text-[#059669]">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.5, ...SPRING }}
            className="text-lg md:text-xl text-[#3A4A3E] font-medium max-w-md mx-auto"
          >
            Every museum visit ends here. Objects made by Pyadra —
            starting with two books, written one real story at a time.
          </motion.p>
        </div>
      </section>

      {/* ============ THE SHELF ============ */}
      <section className="max-w-5xl mx-auto px-6 pb-24 md:pb-32 space-y-6 md:space-y-8">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </section>

      {/* ============ COMING LATER ============ */}
      <section className="max-w-5xl mx-auto px-6 pb-24 md:pb-32 text-center">
        <motion.p {...pop} className="text-[13px] font-semibold text-[#6B8070] mb-5">
          The shelf grows with the museum
        </motion.p>
        <motion.div {...pop} className="flex items-center justify-center gap-2.5 flex-wrap">
          {LATER.map((item) => (
            <span key={item} className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#6B8070] ring-1 ring-[#1A1C1A]/8 shadow-sm">
              {item}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ============ THE NOTE ============ */}
      <section className="max-w-3xl mx-auto px-6 pb-28 md:pb-36">
        <motion.div {...pop} className="rounded-[36px] bg-[#1A1C1A] text-white p-8 md:p-14 text-center relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 60% at 50% 100%, rgba(5,150,105,0.16), transparent 70%)' }} />
          <p className="relative font-serif italic text-2xl md:text-[1.8rem] font-normal leading-snug mb-6">
            &ldquo;Everything in this shop comes from something that really happened.
            <span className="text-[#10B981]"> Not what happened — what it felt like.</span>&rdquo;
          </p>
          <p className="relative text-[13px] text-white/50 font-medium">
            Written and made by Pyadra · digital first, delivered to your email
          </p>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="max-w-5xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-t border-[#1A1C1A]/8 pt-7">
          <span className="text-[12px] font-medium text-[#6B8070]">© 2026 Pyadra · We document. We verify. You decide.</span>
          <div className="flex gap-5">
            <Link href="/exhibitions/galaxy" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">Galaxy</Link>
            <Link href="/" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
