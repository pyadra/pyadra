import Link from "next/link";

export default function Manifesto() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#E3DAC9] font-sans selection:bg-[#FFB000]/20 selection:text-[#FFB000] flex justify-center py-24 md:py-32 px-6">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-[10px] uppercase font-mono tracking-widest text-[#FFB000]/60 hover:text-[#FFB000] transition-colors mb-12 block">
          [ Return to Core ]
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-serif italic font-light mb-16 text-[#F4EFEA] tracking-wider drop-shadow-[0_0_15px_rgba(255,176,0,0.2)]">
          The Manifesto
        </h1>

        <div className="space-y-12 font-light text-[13px] md:text-[15px] leading-relaxed text-[#E3DAC9]/80 tracking-wide">
          
          <section>
            <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFB000] mb-4">01. What is Pyadra?</h2>
            <p>
              Pyadra is not a software company, nor a traditional venture firm. Pyadra is a human collective—an ecosystem designed to incubate, support, and scale ideas that bridge human connection. We consider Pyadra a living organism where resources (capital, talent, and energy) flow dynamically to the nodes (projects) that need them most.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFB000] mb-4">02. The Ritual of Support</h2>
            <p>
              We believe in &quot;people helping people.&quot; The modern internet has commercialized connection. Pyadra returns it to a ritualistic state. When you deploy capital into a Pyadra node—whether buying a coffee for Orbit 77 or funding a digital memory vault—you are not just executing a transaction. You are participating in a ritual of collective nourishment.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFB000] mb-4">03. The Ecosystem Nodes</h2>
            <p className="mb-4">
              Our matrix currently houses specialized nodes spanning multiple industries:
            </p>
            <ul className="list-none space-y-2 border-l border-[#FFB000]/20 pl-4 ml-2">
              <li><strong className="text-[#FFB000] font-normal">Orbit 77:</strong> A global podcast and entertainment brand bridging diverse voices.</li>
              <li><strong className="text-[#FFB000] font-normal">EtherniCapsule:</strong> A digital memory vault securing messages for the future.</li>
              <li><strong className="text-[#FFB000] font-normal">Figurines:</strong> Hyper-personalized 3D physical artifacts bridging the digital gap.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FFB000] mb-4">04. The Core Directive</h2>
            <p>
              Our ultimate objective is perpetual motion. As projects succeed, their energy is funneled back into the Pyadra Core to birth new nodes. We are building an autonomous foundation of human creativity.
            </p>
          </section>

        </div>

        <div className="mt-24 border-t border-white/10 pt-8 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-white/40">
          <span>End of Transmission</span>
          <span>© {new Date().getFullYear()} Pyadra</span>
        </div>
      </div>
    </main>
  );
}
