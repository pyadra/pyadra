'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FigurinesSealed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#02040A] px-4 select-none overflow-hidden relative">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#dca88f] opacity-[0.03] blur-[150px] rounded-full"></div>
      </div>

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.5, ease: "easeOut" }}
         className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center px-6"
      >
        {/* Visual Separator */}
        <div className="mb-12">
           <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#C4A882]/40 to-transparent mx-auto"></div>
        </div>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(196,168,130,0.2)]">
          <span className="text-[#C4A882] text-4xl">✓</span>
        </div>

        <h1 className="text-4xl md:text-6xl text-[#E8D9BB] italic mb-6 text-center font-light leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
          The Forge Ignites
        </h1>

        <p className="text-[#F5F0E6] text-lg md:text-xl font-sans font-light leading-relaxed mb-6 max-w-xl">
          Your geometry has been transmitted successfully. The neural engine is now processing your facial structure.
        </p>

        <p className="text-[#C4A882] text-[15px] font-sans font-light italic mb-16 max-w-md leading-relaxed">
          Check your email for the official transmission receipt. Expected materialization within 14-21 cycles (business days).
        </p>

        {/* Status Badge */}
        <div className="border border-[#C4A882]/30 bg-[#0A0C14]/80 backdrop-blur-md px-12 py-8 rounded-lg mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <p className="text-[#C4A882]/70 text-[10px] uppercase tracking-[0.4em] font-mono mb-3">
              FABRICATION STATUS
            </p>
            <p className="text-[#C4A882] text-2xl tracking-[0.4em] font-mono font-bold">
              FORGING
            </p>
        </div>

        {/* What Happens Next Section */}
        <div className="w-full bg-[#0A0C14]/60 backdrop-blur-md border border-[#C4A882]/20 p-8 rounded-lg mb-16 text-left">
          <h2 className="text-[#E8D9BB] text-2xl font-medium mb-6 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
            What Happens Next
          </h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#C4A882] text-sm font-mono">1</span>
              </div>
              <div>
                <h3 className="text-[#E8D9BB] font-medium mb-1 text-[15px]">Neural Processing (Day 1-3)</h3>
                <p className="text-[#E8D9BB]/70 text-[14px] font-light leading-relaxed">
                  Our AI analyzes your photos to generate a precise 3D mesh. You'll receive an email when this completes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#C4A882] text-sm font-mono">2</span>
              </div>
              <div>
                <h3 className="text-[#E8D9BB] font-medium mb-1 text-[15px]">3D Printing (Day 4-7)</h3>
                <p className="text-[#E8D9BB]/70 text-[14px] font-light leading-relaxed">
                  High-resolution resin printing begins. Each layer is UV-cured for maximum detail.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#C4A882] text-sm font-mono">3</span>
              </div>
              <div>
                <h3 className="text-[#E8D9BB] font-medium mb-1 text-[15px]">Hand-Painting & QA (Day 8-14)</h3>
                <p className="text-[#E8D9BB]/70 text-[14px] font-light leading-relaxed">
                  Skilled artisans apply multiple pigment layers. QR blocks are embedded for Signal tier orders.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#C4A882] text-sm font-mono">4</span>
              </div>
              <div>
                <h3 className="text-[#E8D9BB] font-medium mb-1 text-[15px]">Shipment (Day 15+)</h3>
                <p className="text-[#E8D9BB]/70 text-[14px] font-light leading-relaxed">
                  Express tracked shipping to your coordinates. You'll receive tracking information via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="w-full bg-[#C4A882]/5 border border-[#C4A882]/20 p-6 rounded-lg mb-16 text-left">
          <h3 className="text-[#C4A882] text-[11px] uppercase tracking-[0.3em] font-mono mb-4 text-center">IMPORTANT NOTES</h3>
          <ul className="space-y-3 text-[#E8D9BB]/80 text-[14px] font-light leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-[#C4A882] text-lg flex-shrink-0">•</span>
              <span>All emails will come from <strong className="text-[#E8D9BB] font-medium">noreply@pyadra.com</strong>. Check your spam folder if you don't see them.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C4A882] text-lg flex-shrink-0">•</span>
              <span>Processing times may vary by ±2-3 days depending on order volume and international shipping delays.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C4A882] text-lg flex-shrink-0">•</span>
              <span>Questions or concerns? Email <strong className="text-[#E8D9BB] font-medium">support@pyadra.com</strong> with your order confirmation.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mb-24">
          <Link
            href="/exhibitions/galaxy/figurines"
            className="flex-1 text-center py-4 px-6 bg-[#0A0C14] border border-[#C4A882]/20 text-[#C4A882]/80 hover:text-[#C4A882] hover:border-[#C4A882]/40 text-[10px] uppercase tracking-[0.3em] font-mono transition-all duration-500 rounded-lg"
            aria-label="Commission another figurine"
          >
            Commission Another
          </Link>
          <Link
            href="/"
            className="flex-1 text-center py-4 px-6 bg-[#0A0C14] border border-[#C4A882]/20 text-[#E8D9BB]/80 hover:text-[#E8D9BB] hover:border-[#C4A882]/40 text-[10px] uppercase tracking-[0.3em] font-mono transition-all duration-500 rounded-lg"
            aria-label="Return to Pyadra homepage"
          >
            Return to Pyadra
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-[#7A6A55] text-[9px] uppercase tracking-[0.3em] font-mono">
          FIGURINES · NEURAL FORGE ACTIVE
        </p>
      </motion.div>
    </div>
  );
}
