"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ActivationProvider } from './components/useActivationState';

// Dynamic import to avoid SSR issues with Three.js
const ProjectsScene = dynamic(() => import('./components/ProjectsScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#0a0603] flex items-center justify-center">
      <div className="text-[#8a5a3a] text-sm font-mono tracking-widest animate-pulse">
        INITIALIZING EXCAVATION SITE...
      </div>
    </div>
  ),
});

export default function ProjectsPage() {
  return (
    <ActivationProvider>
      <div className="relative w-full h-screen overflow-hidden bg-[#0a0603]">
        <Suspense fallback={null}>
          <ProjectsScene />
        </Suspense>
      </div>
    </ActivationProvider>
  );
}
