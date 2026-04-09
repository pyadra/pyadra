'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectNav from '../../components/ProjectNav';
import LiveBackground from '../../components/LiveBackground';

export default function FigurinesUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate: 3-5 photos
    if (selectedFiles.length < 3) {
      setError('Please upload at least 3 photos');
      return;
    }
    if (selectedFiles.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    // Validate: only images
    const allImages = selectedFiles.every(file => file.type.startsWith('image/'));
    if (!allImages) {
      setError('Only image files are allowed');
      return;
    }

    setError('');
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length < 3 || files.length > 5) {
      setError('Please upload 3-5 photos');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload photos to server
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photo_${index}`, file);
      });
      formData.append('email', email);

      const res = await fetch('/api/figurines/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setUploading(false);
        return;
      }

      // Redirect to checkout with order_id
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError('Failed to create checkout session');
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040A] text-[#F5F0E6] flex flex-col items-center px-6 py-12 font-sans font-light">

      {/* LIVE BACKGROUND */}
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

      <div className="w-full max-w-2xl mt-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Title */}
          <div className="text-center mb-12">
            <div className="text-[#C4A882] text-xs uppercase tracking-[0.4em] font-mono mb-4">
              Step 1 of 2
            </div>
            <h1 className="text-4xl md:text-5xl text-[#E8D9BB] italic mb-4 font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Upload Your Selfies
            </h1>
            <p className="text-[#E8D9BB]/70 text-base max-w-xl mx-auto leading-relaxed">
              Send us 3-5 clear photos of your face from different angles. We'll create your figurine from these.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[#0A0C14]/60 backdrop-blur-md border border-[#C4A882]/20 p-6 rounded-lg mb-8">
            <h3 className="text-[#E8D9BB] text-lg mb-4 font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Photo Guidelines
            </h3>
            <ul className="space-y-3 text-[#E8D9BB]/70 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882]">✓</span>
                <span>3-5 photos (front, side, 3/4 angle recommended)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882]">✓</span>
                <span>Clear, well-lit photos (natural light works best)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882]">✓</span>
                <span>Face clearly visible (no sunglasses, hats optional)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C4A882]">✓</span>
                <span>Neutral expression for best results</span>
              </li>
            </ul>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[#E8D9BB] text-sm mb-2 font-medium">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0A0C14]/60 border border-[#C4A882]/20 rounded-lg px-4 py-3 text-[#E8D9BB] focus:border-[#C4A882] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
              <p className="text-[#E8D9BB]/50 text-xs mt-2">
                We'll send your order confirmation here
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="photos" className="block text-[#E8D9BB] text-sm mb-2 font-medium">
                Upload Photos (3-5 required)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full bg-[#0A0C14]/60 border border-[#C4A882]/20 rounded-lg px-4 py-3 text-[#E8D9BB] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:uppercase file:tracking-wider file:bg-[#C4A882]/10 file:text-[#C4A882] hover:file:bg-[#C4A882]/20 file:cursor-pointer focus:border-[#C4A882] focus:outline-none transition-colors"
                />
              </div>
              {files.length > 0 && (
                <p className="text-[#C4A882] text-xs mt-2">
                  {files.length} photo{files.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#8B4444]/10 border border-[#8B4444] p-4 rounded-lg">
                <p className="text-[#8B4444] text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || files.length < 3}
              className="group relative overflow-hidden bg-[#C4A882]/10 border border-[#C4A882] px-10 py-5 w-full text-center transition-all duration-700 hover:bg-[#C4A882]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(196,168,130,0.1)] rounded-lg"
            >
              {!uploading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A882]/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]" aria-hidden="true"></div>
              )}
              <span className="relative z-10 text-[#C4A882] tracking-[0.3em] text-xs uppercase font-mono font-bold">
                {uploading ? 'UPLOADING...' : 'CONTINUE TO PAYMENT'}
              </span>
            </button>

            <p className="text-center text-[#E8D9BB]/40 text-xs">
              Next step: Payment (A$175 AUD)
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
