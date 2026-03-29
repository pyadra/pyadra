export default function Capsule3D({ isSealed = true }: { isSealed?: boolean }) {
  // A monolithic, levitating black-glass pill/capsule containing amber energy.
  return (
    <div className="relative w-[120px] h-[340px] flex items-center justify-center">
      
      {/* Outer Halo / Energy Bleed */}
      <div 
        className={`absolute inset-0 bg-[#C4A882] rounded-full blur-[60px] transition-all duration-[3000ms] pointer-events-none ${
          isSealed ? 'opacity-20 scale-90' : 'opacity-80 scale-150 animate-pulse'
        }`}
      ></div>

      {/* The levitating monolith container */}
      <div className="relative w-[90px] h-[300px] animate-[levitate_8s_ease-in-out_infinite]">
        
        {/* Core Geometry - The Pill */}
        <div 
          className="absolute inset-0 rounded-[100px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,1)]"
          style={{ 
            background: 'linear-gradient(180deg, #1A1410 0%, #060504 35%, #060504 65%, #1A1410 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), inset 20px 0 20px -10px rgba(196,168,130,0.1), inset -20px 0 20px -10px rgba(196,168,130,0.05)'
          }}
        >
          {/* Internal Glowing Core */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] rounded-full bg-[#E8D9BB] blur-[25px] transition-all duration-[2000ms] ${
              isSealed ? 'h-[140px] opacity-40' : 'h-[250px] opacity-100'
            }`}
          ></div>

          {/* Liquid/Glass specular reflections */}
          <div className="absolute top-4 left-[15%] w-[10px] h-[80%] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.05)] via-[rgba(255,255,255,0.15)] to-transparent opacity-80 mix-blend-overlay"></div>
          <div className="absolute bottom-6 right-[15%] w-[5px] h-[40%] rounded-full bg-gradient-to-t from-[rgba(196,168,130,0.2)] to-transparent opacity-60"></div>

          {/* Central Seam / Key Slot */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#000000] z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[24px] bg-[#000000] rounded-full z-20 shadow-[inset_0_2px_5px_rgba(0,0,0,1)] flex items-center justify-center">
             {/* The spark inside the keyhole */}
             <div className={`w-[2px] bg-[#C4A882] rounded-full transition-all duration-1000 ${isSealed ? 'h-[8px] opacity-40' : 'h-[16px] opacity-100 shadow-[0_0_10px_#C4A882]'}`}></div>
          </div>

          {/* Dark gradient caps (top and bottom geometry) */}
          <div className="absolute top-0 left-0 right-0 h-[40px] bg-gradient-to-b from-black to-transparent opacity-90 z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-black to-transparent opacity-90 z-10"></div>
        </div>
      </div>

      <style>{`
        @keyframes levitate {
          0%, 100% { transform: translateY(0) rotateX(2deg) rotateY(-5deg); }
          50% { transform: translateY(-15px) rotateX(-2deg) rotateY(5deg); }
        }
      `}</style>
    </div>
  );
}
