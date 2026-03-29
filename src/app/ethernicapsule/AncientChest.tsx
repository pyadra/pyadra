'use client';
import { useEffect, useState } from 'react';

export default function AncientChest({ isSealed = false }: { isSealed?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex items-center justify-center mx-auto mt-4 mb-8" style={{ perspective: '1600px', width: '320px', height: '240px' }}>
      
      {/* Light source / Ambient Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 pointer-events-none transition-all duration-1000 -top-[100px] -left-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(122,82,48,0.3) 0%, rgba(6,5,4,0) 60%)' }}
      ></div>

      {/* 3D Container Prism (rotates on Y) */}
      <div 
        className={`relative w-[280px] h-[180px] transform-style-3d ${!isSealed ? 'animate-chest-spin' : ''} transition-transform duration-[5000ms]`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div 
          className="absolute inset-0 border border-[#2A160A]/80 flex items-center justify-center shadow-[inset_0_30px_60px_rgba(0,0,0,0.6)]" 
          style={{ transform: 'translateZ(90px)', background: 'linear-gradient(135deg, #7A5230 0%, #3D2010 60%, #150802 100%)' }}
        >
          {/* Metallic corners */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-br-lg border-b border-r border-[#1A0E06]" style={{ background: 'linear-gradient(to bottom right, #6B4423, #2A160A)' }}></div>
          <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-lg border-b border-l border-[#1A0E06]" style={{ background: 'linear-gradient(to bottom left, #4A2912, #150802)' }}></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 rounded-tr-lg border-t border-r border-[#1A0E06]" style={{ background: 'linear-gradient(to top right, #3A1E0D, #0A0401)' }}></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-tl-lg border-t border-l border-[#1A0E06]" style={{ background: 'linear-gradient(to top left, #2A160A, #050201)' }}></div>
          
          {/* Hardware Lock/Keyhole */}
          <div className="w-10 h-14 border border-[#1A0E06] rounded-t-full shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center" style={{ background: 'linear-gradient(to bottom, #6B4423, #3A1E0D)' }}>
             <div className="w-2 h-4 rounded-full bg-[#050201] shadow-[inset_0_2px_4px_rgba(0,0,0,1)] flex flex-col items-center">
                <div className="w-2.5 h-2.5 bg-[#050201] rounded-full mt-[10px] -ml-[0px]"></div>
             </div>
          </div>
        </div>
        
        {/* BACK */}
        <div 
          className="absolute inset-0 border border-[#150802] shadow-[inset_0_50px_100px_rgba(0,0,0,0.9)]" 
          style={{ transform: 'rotateY(180deg) translateZ(90px)', background: 'linear-gradient(to bottom, #3D2010 0%, #0A0401 100%)' }}
        >
          {/* Back vertical hinges */}
          <div className="absolute left-10 inset-y-0 w-4 bg-gradient-to-b from-[#4A2912] to-[#150802] border-x border-[#1A0E06] shadow-[2px_0_5px_rgba(0,0,0,0.5)]"></div>
          <div className="absolute right-10 inset-y-0 w-4 bg-gradient-to-b from-[#2A160A] to-[#0A0401] border-x border-[#0A0401] shadow-[-2px_0_5px_rgba(0,0,0,0.5)]"></div>
        </div>
        
        {/* LEFT (Receives light) */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 -ml-[90px] w-[180px] h-[180px] border border-[#2A160A]/80 shadow-[inset_0_30px_60px_rgba(0,0,0,0.5)]" 
          style={{ transform: 'rotateY(-90deg) translateZ(140px)', background: 'linear-gradient(135deg, #8B5A33 0%, #4A2912 60%, #150802 100%)' }}
        >
            <div className="absolute inset-y-10 left-1/2 -ml-3 w-6 bg-gradient-to-b from-[#6B4423] to-[#2A160A] border rounded-sm border-[#1A0E06] shadow-md"></div>
        </div>
        
        {/* RIGHT (Dark/Shadow) */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 -ml-[90px] w-[180px] h-[180px] border border-[#150802] shadow-[inset_0_20px_40px_rgba(0,0,0,0.9)]" 
          style={{ transform: 'rotateY(90deg) translateZ(140px)', background: 'linear-gradient(to left, #2A160A 0%, #050201 100%)' }}
        >
            <div className="absolute inset-y-10 left-1/2 -ml-3 w-6 bg-gradient-to-b from-[#2A160A] to-[#050201] border rounded-sm border-[#050201]"></div>
        </div>
        
        {/* TOP / LID (Receives light) */}
        <div 
          className="absolute left-0 right-0 top-1/2 -mt-[90px] w-[280px] h-[180px] border border-[#4A2912]/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" 
          style={{ transform: 'rotateX(90deg) translateZ(90px)', background: 'linear-gradient(135deg, #7A5230 0%, #4A2912 50%, #1A0E06 100%)' }}
        >
            {/* Horizontal wood planks detail */}
            <div className="absolute inset-x-0 top-1/3 h-[1px] bg-[#2A160A] opacity-50"></div>
            <div className="absolute inset-x-0 top-2/3 h-[1px] bg-[#2A160A] opacity-50"></div>
        </div>

        {/* BOTTOM (Pitch black) */}
        <div 
          className="absolute left-0 right-0 top-1/2 -mt-[90px] w-[280px] h-[180px] bg-[#050201] shadow-[0_40px_100px_rgba(0,0,0,1)]" 
          style={{ transform: 'rotateX(-90deg) translateZ(90px)' }}
        ></div>

        {/* Sealed internal pulse glow inside the box if we can see gaps */}
        {isSealed && (
          <div className="absolute inset-0 w-[280px] h-[180px] bg-[#C4A882] blur-[80px] opacity-10 animate-pulse pointer-events-none" style={{ transform: 'translateZ(0px)' }}></div>
        )}
      </div>

      <style jsx global>{`
        @keyframes chest-spin {
          from { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          to { transform: rotateY(360deg); }
        }
        .animate-chest-spin {
          animation: chest-spin 20s infinite linear;
        }
      `}</style>
    </div>
  );
}
