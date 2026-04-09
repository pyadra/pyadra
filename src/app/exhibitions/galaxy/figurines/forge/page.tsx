'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function FigurinesForgeContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [leftPhoto, setLeftPhoto] = useState<File | null>(null);
  const [rightPhoto, setRightPhoto] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string>('');
  const [leftPreview, setLeftPreview] = useState<string>('');
  const [rightPreview, setRightPreview] = useState<string>('');

  const [fileErrors, setFileErrors] = useState<{front?: string, left?: string, right?: string}>({});

  // Get tier from session storage or URL (defaults to base tier)
  const [tier] = useState<'figurine_only' | 'figurine_signal'>('figurine_only');

  const frontRef = useRef<HTMLInputElement>(null);
  const leftRef = useRef<HTMLInputElement>(null);
  const rightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!sessionId) {
      router.push('/exhibitions/galaxy/figurines');
    }
  }, [sessionId, router]);

  const validateFile = (file: File): string | null => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return `File too large (max 10MB)`;
    }
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      return `Invalid format (JPG/PNG only)`;
    }
    return null;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: 'front' | 'left' | 'right'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setFileErrors(prev => ({ ...prev, [fieldName]: validationError }));
        setter(null);
        previewSetter('');
        return;
      }

      setFileErrors(prev => ({ ...prev, [fieldName]: undefined }));
      setter(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransmit = async () => {
    if (!name || !address || !frontPhoto || !leftPhoto || !rightPhoto) {
      setError("Incomplete geometry. Please provide all 3 angles and your destination.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('session_id', sessionId!);
      formData.append('name', name);
      formData.append('address', address);
      formData.append('front', frontPhoto);
      formData.append('left', leftPhoto);
      formData.append('right', rightPhoto);

      const res = await fetch('/api/figurines/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        router.push('/exhibitions/galaxy/figurines/sealed');
      } else {
        const data = await res.json();
        setError(data.error || "Transmission failed.");
        setLoading(false);
      }
    } catch {
      setError("Network displacement. Please try again.");
      setLoading(false);
    }
  };

  const isPhotosComplete = frontPhoto && leftPhoto && rightPhoto;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#02040A] text-[#F5F0E6] flex flex-col items-center justify-center pt-24 pb-32 px-6 overflow-x-hidden font-sans font-light selection:bg-[#C4A882] selection:text-[#02040A]">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#C4A882] opacity-[0.03] blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">

        {/* Header with Progress */}
        <div className="w-full flex flex-col items-center mb-12">
          <div className="text-[11px] uppercase text-[#C4A882] tracking-[0.4em] mb-4 font-mono">
            THE NEURAL FORGE
          </div>

          <h1 className="text-4xl md:text-5xl text-[#E8D9BB] italic mb-6 text-center font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Submit Your Geometry
          </h1>

          {/* Progress Indicator */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="text-[10px] text-[#E8D9BB]/80 tracking-[0.3em] uppercase font-mono" role="status" aria-live="polite" aria-label={`Step ${step} of 2`}>
              STEP {step} OF 2
            </div>
            <div className="flex gap-3" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    i === step
                      ? 'bg-[#C4A882] shadow-[0_0_12px_currentColor] scale-110'
                      : i < step
                      ? 'bg-[#C4A882]/60'
                      : 'bg-[#C4A882]/20'
                  }`}
                  aria-label={`Step ${i}${i === step ? ' (current)' : i < step ? ' (completed)' : ' (upcoming)'}`}
                />
              ))}
            </div>
          </div>

          {/* Tier Badge */}
          <div className="px-6 py-2 bg-[#C4A882]/10 border border-[#C4A882]/30 rounded-full">
            <span className="text-[9px] text-[#C4A882] tracking-[0.3em] uppercase font-mono">
              {tier === 'figurine_signal' ? 'CAST + SIGNAL TIER' : 'PHYSICAL CAST TIER'}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              className="w-full flex flex-col items-center"
            >
              {/* Photo Guide */}
              <div className="w-full bg-[#0A0C14]/60 backdrop-blur-md border border-[#C4A882]/20 p-6 mb-10 rounded-lg">
                <h3 className="text-[#E8D9BB] text-lg font-medium mb-4 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Photo Requirements
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-[13px] text-[#E8D9BB]/70">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center mb-3">
                      <span className="text-[#C4A882] text-xl">✓</span>
                    </div>
                    <p className="font-light">Neutral expression, good lighting</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center mb-3">
                      <span className="text-[#C4A882] text-xl">✓</span>
                    </div>
                    <p className="font-light">Plain background, no obstructions</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#C4A882]/10 border border-[#C4A882]/30 flex items-center justify-center mb-3">
                      <span className="text-[#C4A882] text-xl">✓</span>
                    </div>
                    <p className="font-light">JPG/PNG, max 10MB per file</p>
                  </div>
                </div>
              </div>

              <p className="text-[#E8D9BB]/80 text-center mb-10 text-lg font-light max-w-xl">
                The neural capture requires three precise angles of your face. Upload clear photos from the front, left side, and right side.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">

                {/* FRONT */}
                <div className="flex flex-col">
                  <div
                     onClick={() => frontRef.current?.click()}
                     className={`aspect-[3/4] border ${frontPhoto ? 'border-[#C4A882] bg-[#C4A882]/5' : 'border-[#C4A882]/20 bg-white/[0.02]'} backdrop-blur-md rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#C4A882]/60 relative overflow-hidden group`}
                     role="button"
                     aria-label="Upload front angle photo"
                     tabIndex={0}
                     onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') frontRef.current?.click();}}
                  >
                     {frontPreview ? (
                        <img src={frontPreview} className="absolute inset-0 w-full h-full object-cover" alt="Front angle preview" />
                     ) : (
                        <span className="text-[#C4A882]/40 text-5xl mb-4 group-hover:text-[#C4A882]/80 transition-colors">+</span>
                     )}
                     <span className="relative z-10 text-[11px] tracking-widest uppercase font-mono text-[#E8D9BB] drop-shadow-md bg-[#02040A]/80 px-4 py-2 rounded">
                        Front Angle
                     </span>
                     <input type="file" ref={frontRef} className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={e => handleFileChange(e, setFrontPhoto, setFrontPreview, 'front')} aria-label="Front angle photo upload" />
                  </div>
                  {fileErrors.front && <p className="text-[#8B4444] text-xs mt-2 text-center font-light italic">{fileErrors.front}</p>}
                </div>

                {/* LEFT */}
                <div className="flex flex-col">
                  <div
                     onClick={() => leftRef.current?.click()}
                     className={`aspect-[3/4] border ${leftPhoto ? 'border-[#C4A882] bg-[#C4A882]/5' : 'border-[#C4A882]/20 bg-white/[0.02]'} backdrop-blur-md rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#C4A882]/60 relative overflow-hidden group`}
                     role="button"
                     aria-label="Upload left profile photo"
                     tabIndex={0}
                     onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') leftRef.current?.click();}}
                  >
                     {leftPreview ? (
                        <img src={leftPreview} className="absolute inset-0 w-full h-full object-cover" alt="Left profile preview" />
                     ) : (
                        <span className="text-[#C4A882]/40 text-5xl mb-4 group-hover:text-[#C4A882]/80 transition-colors">+</span>
                     )}
                     <span className="relative z-10 text-[11px] tracking-widest uppercase font-mono text-[#E8D9BB] drop-shadow-md bg-[#02040A]/80 px-4 py-2 rounded">
                        Left Profile
                     </span>
                     <input type="file" ref={leftRef} className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={e => handleFileChange(e, setLeftPhoto, setLeftPreview, 'left')} aria-label="Left profile photo upload" />
                  </div>
                  {fileErrors.left && <p className="text-[#8B4444] text-xs mt-2 text-center font-light italic">{fileErrors.left}</p>}
                </div>

                {/* RIGHT */}
                <div className="flex flex-col">
                  <div
                     onClick={() => rightRef.current?.click()}
                     className={`aspect-[3/4] border ${rightPhoto ? 'border-[#C4A882] bg-[#C4A882]/5' : 'border-[#C4A882]/20 bg-white/[0.02]'} backdrop-blur-md rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#C4A882]/60 relative overflow-hidden group`}
                     role="button"
                     aria-label="Upload right profile photo"
                     tabIndex={0}
                     onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') rightRef.current?.click();}}
                  >
                     {rightPreview ? (
                        <img src={rightPreview} className="absolute inset-0 w-full h-full object-cover" alt="Right profile preview" />
                     ) : (
                        <span className="text-[#C4A882]/40 text-5xl mb-4 group-hover:text-[#C4A882]/80 transition-colors">+</span>
                     )}
                     <span className="relative z-10 text-[11px] tracking-widest uppercase font-mono text-[#E8D9BB] drop-shadow-md bg-[#02040A]/80 px-4 py-2 rounded">
                        Right Profile
                     </span>
                     <input type="file" ref={rightRef} className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={e => handleFileChange(e, setRightPhoto, setRightPreview, 'right')} aria-label="Right profile photo upload" />
                  </div>
                  {fileErrors.right && <p className="text-[#8B4444] text-xs mt-2 text-center font-light italic">{fileErrors.right}</p>}
                </div>

              </div>

              <button
                 onClick={() => setStep(2)}
                 disabled={!isPhotosComplete}
                 className="group relative overflow-hidden bg-[#0A0C14] border border-[#C4A882]/30 px-20 py-5 text-center transition-all duration-700 hover:border-[#C4A882] disabled:opacity-50 min-w-[280px] rounded-lg"
                 aria-label="Continue to shipping details"
              >
                 {isPhotosComplete && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A882]/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]" aria-hidden="true"></div>}
                 <span className="relative z-10 text-[#C4A882] tracking-[0.3em] text-[12px] uppercase font-mono font-medium">
                   PROCEED TO DETAILS
                 </span>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              className="w-full flex flex-col items-center max-w-lg"
            >
              <p className="text-[#E8D9BB]/80 text-center mb-10 text-lg font-light">
                Identify yourself and provide the physical coordinates where the artifact shall be delivered.
              </p>

              <div className="w-full mb-8">
                 <label className="text-[11px] uppercase text-[#C4A882] tracking-widest font-mono pl-2 mb-2 block">Legal Name</label>
                 <input
                   type="text"
                   value={name}
                   onChange={e => setName(e.target.value)}
                   className="w-full bg-[#02040A]/60 backdrop-blur-md border border-[#C4A882]/20 text-[#F5F0E6] focus:outline-none focus:border-[#C4A882]/80 px-6 py-5 transition-colors font-sans rounded-lg"
                   placeholder="Full name as it appears on ID"
                   aria-label="Enter your full legal name"
                 />
              </div>

              <div className="w-full mb-12">
                 <label className="text-[11px] uppercase text-[#C4A882] tracking-widest font-mono pl-2 mb-2 block">Full Shipping Coordinates</label>
                 <textarea
                   value={address}
                   onChange={e => setAddress(e.target.value)}
                   placeholder="Street address, City, State/Province, Postcode, Country..."
                   className="w-full bg-[#02040A]/60 backdrop-blur-md border border-[#C4A882]/20 text-[#F5F0E6] focus:outline-none focus:border-[#C4A882]/80 px-6 py-5 transition-colors min-h-[140px] font-sans resize-none rounded-lg"
                   aria-label="Enter your complete shipping address"
                 />
              </div>

              {error && (
                <div className="w-full bg-[#8B4444]/10 border border-[#8B4444] p-4 mb-8 rounded-lg" role="alert">
                  <p className="text-[#8B4444] font-sans italic text-sm text-center">{error}</p>
                </div>
              )}

              <div className="flex gap-4 w-full">
                <button
                   onClick={() => setStep(1)}
                   disabled={loading}
                   className="text-[#E8D9BB]/50 uppercase text-[11px] tracking-[0.3em] font-mono hover:text-[#E8D9BB] py-5 px-8 transition-colors disabled:opacity-50"
                   aria-label="Go back to photo upload"
                >
                   ← BACK
                </button>
                <button
                   onClick={handleTransmit}
                   disabled={!name || !address || loading}
                   className="flex-grow group relative overflow-hidden bg-[#C4A882]/10 border border-[#C4A882] px-10 py-5 text-center transition-all duration-700 hover:bg-[#C4A882]/20 disabled:opacity-50 shadow-[0_0_20px_rgba(196,168,130,0.1)] rounded-lg"
                   aria-label="Submit order and begin fabrication"
                >
                   {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A882]/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]" aria-hidden="true"></div>}
                   <span className="relative z-10 text-[#C4A882] tracking-[0.3em] text-[12px] uppercase font-mono font-bold">
                     {loading ? 'TRANSMITTING...' : 'FORGE ARTIFACT'}
                   </span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function FigurinesForge() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#02040A]">
        <div className="text-[#C4A882] animate-pulse text-sm font-mono tracking-[0.3em]">
          LOADING FORGE...
        </div>
      </div>
    }>
      <FigurinesForgeContent />
    </Suspense>
  );
}
