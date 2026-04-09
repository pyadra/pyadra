'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FigurineCanvas from './components/FigurineCanvas';
import ProjectNav from '../components/ProjectNav';
import LiveBackground from '../components/LiveBackground';

export default function FigurinesPage() {
  return (
    <div className="min-h-screen bg-[#02040A] text-[#F5F0E6] flex flex-col items-center overflow-x-hidden font-sans font-light selection:bg-[#C4A882] selection:text-[#02040A]">

      {/* LIVE BACKGROUND - lightweight particles */}
      <LiveBackground color="#DCA88F" intensity="low" />

      {/* EXPERIMENTAL NAV */}
      <ProjectNav
        projectName="Figurines"
        projectColor="#DCA88F"
        links={[
          { href: "/exhibitions/galaxy/figurines", label: "Gallery" },
          { href: "/exhibitions/galaxy/figurines/upload", label: "Commission" }
        ]}
      />

      {/* 3D SCENE BACKGROUND */}
      <div className="w-full h-[40vh] relative mt-20 z-10">
        <div className="absolute inset-0">
          <FigurineCanvas />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 -mt-32">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mb-16"
        >

          <div className="text-center bg-[#02040A]/80 backdrop-blur-xl px-8 py-12 rounded-lg border border-[#C4A882]/20">
            <div className="text-[#C4A882] text-xs uppercase tracking-[0.4em] font-mono mb-4">
              Limited Handcraft
            </div>

            <h1 className="text-5xl md:text-7xl text-[#E8D9BB] italic mb-6 font-light leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
              You, Immortalized<br/>in 3D
            </h1>

            <p className="text-[#E8D9BB]/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-6">
              Send us your selfies. We craft a hand-painted figurine of your face—unique, physical, permanent.
            </p>

            <p className="text-[#C4A882]/70 text-sm max-w-xl mx-auto">
              Each piece is sculpted from scratch, 3D printed in high-res resin, and painted by hand. No mass production. No duplicates.
            </p>
          </div>
        </motion.div>

        {/* DATABASE ERROR */}
        {/* PROCESS GALLERY */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl text-[#E8D9BB] italic mb-8 text-center font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
            The Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="group relative aspect-square overflow-hidden border border-[#C4A882]/20 bg-[#0A0C14]/80 backdrop-blur-md hover:border-[#C4A882]/60 transition-all duration-500">
              <img
                src="/figurines/examples/digital-design.jpg"
                alt="3D Digital Model - AI-generated chibi character from customer photos"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-[#02040A]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <h3 className="text-[#E8D9BB] text-xl font-medium mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Digital 3D Model</h3>
                <p className="text-[#C4A882]/80 text-sm font-light">AI-generated from your selfies</p>
              </div>
            </div>

            <div className="group relative aspect-square overflow-hidden border border-[#C4A882]/20 bg-[#0A0C14]/80 backdrop-blur-md hover:border-[#C4A882]/60 transition-all duration-500">
              <img
                src="/figurines/examples/printed-figurine.jpg"
                alt="Finished hand-painted figurine - chibi style with custom details"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-[#02040A]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <h3 className="text-[#E8D9BB] text-xl font-medium mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Finished Figurine</h3>
                <p className="text-[#C4A882]/80 text-sm font-light">3D printed & hand-painted</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[#C4A882]/80 text-sm font-medium uppercase tracking-wider">
              ↑ Real examples from our studio
            </p>
            <p className="text-[#E8D9BB]/60 text-sm font-light max-w-2xl mx-auto">
              Each figurine is unique. Handcrafted work takes 3-6 weeks. Shipping worldwide included.
            </p>
          </div>
        </motion.section>

        {/* WHY THIS IS SPECIAL */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl text-[#E8D9BB] italic mb-8 font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Why People Want This
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-[#C4A882] text-4xl mb-3">✦</div>
                <h3 className="text-[#E8D9BB] text-lg mb-2 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Physical Memory
                </h3>
                <p className="text-[#E8D9BB]/60 text-sm font-light">
                  A tangible version of yourself that lasts. Not just pixels—something real you can hold.
                </p>
              </div>

              <div>
                <div className="text-[#C4A882] text-4xl mb-3">✦</div>
                <h3 className="text-[#E8D9BB] text-lg mb-2 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Handmade Craft
                </h3>
                <p className="text-[#E8D9BB]/60 text-sm font-light">
                  No factory lines. Every figurine is individually modeled, printed, and painted. Hours of work.
                </p>
              </div>

              <div>
                <div className="text-[#C4A882] text-4xl mb-3">✦</div>
                <h3 className="text-[#E8D9BB] text-lg mb-2 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Conversation Piece
                </h3>
                <p className="text-[#E8D9BB]/60 text-sm font-light">
                  People notice. "Wait, is that you?" It's weird, personal, and totally unique to you.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SINGLE TIER PRICING */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="max-w-md mx-auto border border-[#C4A882]/30 bg-[#02040A]/90 backdrop-blur-xl p-10 text-center shadow-[0_0_50px_rgba(196,168,130,0.1)] transition-all duration-700 hover:shadow-[0_0_80px_rgba(196,168,130,0.2)] hover:border-[#C4A882]/60 rounded-lg">

            <div className="inline-block px-4 py-1 bg-[#C4A882]/10 border border-[#C4A882]/30 rounded-full mb-6">
              <span className="text-[#C4A882] text-[10px] uppercase tracking-[0.3em] font-mono">
                One-of-a-kind
              </span>
            </div>

            <h3 className="text-4xl text-[#E8D9BB] italic mb-3 font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Your Figurine
            </h3>

            <p className="text-[#E8D9BB]/60 text-sm mb-6 font-light">
              Chibi-style, hand-painted, yours forever
            </p>

            <div className="text-[#C4A882] text-3xl tracking-[0.2em] font-mono mb-10">
              A$175
            </div>

            <ul className="text-left space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882] text-xl">✓</span>
                <span className="text-[#E8D9BB]/80 text-base font-light">Custom 3D model from your selfies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882] text-xl">✓</span>
                <span className="text-[#E8D9BB]/80 text-base font-light">Resin 3D print (high detail)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882] text-xl">✓</span>
                <span className="text-[#E8D9BB]/80 text-base font-light">Hand-painted by artisan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882] text-xl">✓</span>
                <span className="text-[#E8D9BB]/80 text-base font-light">Ships worldwide (included)</span>
              </li>
            </ul>

            <Link
              href="/exhibitions/galaxy/figurines/upload"
              className="group relative overflow-hidden bg-[#C4A882]/10 border border-[#C4A882] px-10 py-5 w-full text-center transition-all duration-700 hover:bg-[#C4A882]/20 shadow-[0_0_20px_rgba(196,168,130,0.1)] rounded-lg block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A882]/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]" aria-hidden="true"></div>
              <span className="relative z-10 text-[#C4A882] tracking-[0.3em] text-xs uppercase font-mono font-bold">
                GET YOUR FIGURINE
              </span>
            </Link>

            <p className="text-[#E8D9BB]/40 text-xs mt-6 font-light">
              Made to order • 3-6 weeks • Limited slots
            </p>
          </div>
        </motion.section>

        {/* SIMPLE FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl md:text-4xl text-[#E8D9BB] italic mb-12 text-center font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Details
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            <details className="group border border-[#C4A882]/20 bg-[#0A0C14]/60 backdrop-blur-md p-6 hover:border-[#C4A882]/40 transition-all duration-300">
              <summary className="text-[#E8D9BB] text-lg cursor-pointer list-none flex justify-between items-center font-medium">
                <span style={{ fontFamily: 'var(--font-cormorant)' }}>What do you need from me?</span>
                <span className="text-[#C4A882] group-open:rotate-45 transition-transform text-2xl">+</span>
              </summary>
              <p className="text-[#E8D9BB]/70 text-sm leading-relaxed mt-4 font-light">
                Clear photos of your face from multiple angles. After purchase, you'll receive instructions for upload.
              </p>
            </details>

            <details className="group border border-[#C4A882]/20 bg-[#0A0C14]/60 backdrop-blur-md p-6 hover:border-[#C4A882]/40 transition-all duration-300">
              <summary className="text-[#E8D9BB] text-lg cursor-pointer list-none flex justify-between items-center font-medium">
                <span style={{ fontFamily: 'var(--font-cormorant)' }}>How long does it take?</span>
                <span className="text-[#C4A882] group-open:rotate-45 transition-transform text-2xl">+</span>
              </summary>
              <p className="text-[#E8D9BB]/70 text-sm leading-relaxed mt-4 font-light">
                Each figurine is handcrafted. Production time varies depending on queue and complexity. Expect 3-6 weeks.
              </p>
            </details>

            <details className="group border border-[#C4A882]/20 bg-[#0A0C14]/60 backdrop-blur-md p-6 hover:border-[#C4A882]/40 transition-all duration-300">
              <summary className="text-[#E8D9BB] text-lg cursor-pointer list-none flex justify-between items-center font-medium">
                <span style={{ fontFamily: 'var(--font-cormorant)' }}>Do you ship internationally?</span>
                <span className="text-[#C4A882] group-open:rotate-45 transition-transform text-2xl">+</span>
              </summary>
              <p className="text-[#E8D9BB]/70 text-sm leading-relaxed mt-4 font-light">
                Yes. Shipping is included in the price. Customs fees may apply depending on your country.
              </p>
            </details>
          </div>
        </motion.section>

      </div>

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-[#C4A882]/10 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link
            href="/exhibitions/galaxy"
            className="text-[#E8D9BB]/40 font-mono text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500 px-6 py-3"
          >
            [ RETURN TO GALAXY ]
          </Link>
          <div className="text-[#7A6A55] text-[9px] tracking-[0.3em] uppercase font-mono">
            FIGURINES · HANDCRAFTED
          </div>
        </div>
      </footer>
    </div>
  );
}
