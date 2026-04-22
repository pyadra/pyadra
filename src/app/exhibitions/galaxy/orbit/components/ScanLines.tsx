"use client";

/**
 * ScanLines - CRT monitor effect
 * Animated horizontal scan lines for terminal/transmission aesthetic
 */
export default function ScanLines() {
  return (
    <>
      {/* Horizontal scan lines */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.15]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(57, 255, 20, 0.03) 2px,
            rgba(57, 255, 20, 0.03) 4px
          )`,
          animation: "scan 8s linear infinite"
        }}
      />

      {/* Vertical flicker */}
      <div
        className="fixed inset-0 pointer-events-none z-[59] opacity-[0.05]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(57,255,20,0.1) 50%, transparent 100%)",
          animation: "flicker 0.15s infinite"
        }}
      />

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }

        @keyframes flicker {
          0% { opacity: 0.05; }
          50% { opacity: 0.08; }
          100% { opacity: 0.05; }
        }
      `}</style>
    </>
  );
}
