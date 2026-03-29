'use client';
import { useEffect, useState } from 'react';

export default function Capsule3D({ isSealed = true, isSealing = false }: { isSealed?: boolean, isSealing?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stage entry materialization
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`relative w-[140px] h-[360px] flex items-center justify-center transition-all duration-[2000ms] ease-out ${mounted ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'}`}>
      
      {/* Outer Halo / Volumetric Energy Bleed */}
      <div 
        className={`absolute inset-0 bg-[#C4A882] rounded-full mix-blend-screen transition-all duration-[3000ms] pointer-events-none z-0 ${
          isSealed 
          ? 'blur-[60px] opacity-20 scale-90' 
          : isSealing 
            ? 'blur-[80px] opacity-100 scale-[1.3] animate-pulse' 
            : 'blur-[70px] opacity-60 scale-110 animate-pulse'
        }`}
      ></div>

      {/* The levitating monolith container */}
      <div className={`relative w-[100px] h-[320px] transition-transform duration-[3000ms] z-10 ${isSealed && !isSealing ? 'animate-[levitate_8s_ease-in-out_infinite]' : (isSealing ? 'translate-y-2' : 'animate-[levitate_5s_ease-in-out_infinite]')}`}>
        
        {/* Core Geometry - The Obsidian Pill */}
        <div 
          className="absolute inset-0 rounded-[100px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] transition-all duration-[3000ms]"
          style={{ 
            background: 'linear-gradient(180deg, #110D09 0%, #030202 35%, #030202 65%, #110D09 100%)',
            boxShadow: `inset 0 0 50px rgba(0,0,0,0.95), inset 20px 0 30px -15px rgba(196,168,130,${isSealed ? '0.1' : '0.25'}), inset -20px 0 30px -15px rgba(196,168,130,${isSealed ? '0.05' : '0.15'})`,
            border: '1px solid rgba(196,168,130,0.08)'
          }}
        >
          {/* Noise Texture Overlay for physical material feel */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

          {/* Internal Glowing Core (The Soul) */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] rounded-full bg-[#E8D9BB] blur-[30px] transition-all duration-[3000ms] ${
              isSealed 
              ? 'h-[140px] opacity-30' 
              : isSealing 
                 ? 'h-[10px] opacity-100 blur-[40px] w-[100px]' 
                 : 'h-[280px] opacity-90 animate-[core_breathe_4s_ease-in-out_infinite]'
            }`}
          ></div>

          {/* Liquid/Glass specular reflections */}
          {/* Left arc highlight */}
          <div className="absolute top-6 left-[12%] w-[12px] h-[75%] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.08)] via-[rgba(255,255,255,0.2)] to-transparent opacity-90 mix-blend-overlay filter blur-[1px]"></div>
          {/* Right rim light */}
          <div className="absolute bottom-6 right-[12%] w-[6px] h-[50%] rounded-full bg-gradient-to-t from-[rgba(196,168,130,0.3)] to-transparent opacity-70 filter blur-[1.5px] mix-blend-screen"></div>

          {/* Central Seam / Key Slot (The Cryptographic Lock) */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#000000] z-20 shadow-[0_1px_0_rgba(255,255,255,0.07)]">
            {/* The seam emits light briefly when sealing */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#E8D9BB] blur-[2px] transition-all duration-[2000ms] ${isSealing ? 'w-[80%] opacity-100 shadow-[0_0_20px_#FFB000]' : 'w-0 opacity-0'}`}></div>
          </div>
          
          {/* The Lock Cylinder */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[32px] bg-[#000000] rounded-full z-20 shadow-[0_0_10px_rgba(0,0,0,1),inset_0_2px_8px_rgba(0,0,0,1)] flex items-center justify-center border border-[rgba(196,168,130,0.1)]">
             {/* The spark inside the keyhole */}
             <div className={`w-[2.5px] bg-[#C4A882] rounded-full transition-all duration-[2000ms] ${isSealing ? 'h-[20px] opacity-100 shadow-[0_0_15px_#FFB000] scale-125' : isSealed ? 'h-[10px] opacity-30 shadow-[0_0_5px_#C4A882]' : 'h-[18px] opacity-100 shadow-[0_0_15px_#C4A882] animate-pulse'}`}></div>
          </div>

          {/* Horizon caps for depth (top/bottom gradient shadows) */}
          <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-black via-[rgba(0,0,0,0.8)] to-transparent opacity-95 z-10 rounded-t-[100px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-black via-[rgba(0,0,0,0.8)] to-transparent opacity-95 z-10 rounded-b-[100px]"></div>
        </div>
      </div>

      <style>{`
        @keyframes levitate {
          0%, 100% { transform: translateY(0) rotateX(2deg) rotateY(-5deg); }
          50% { transform: translateY(-15px) rotateX(-2deg) rotateY(5deg); }
        }
        @keyframes core_breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
