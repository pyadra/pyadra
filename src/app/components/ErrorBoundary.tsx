"use client";

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for catching errors in 3D scenes and other components
 * Prevents the entire app from crashing when Three.js or other rendering errors occur
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] bg-black/20 rounded-lg border border-white/5 p-8">
          <div className="text-center">
            <p className="text-[10px] font-mono tracking-widest uppercase text-red-400/70 mb-4">
              [ RENDER ERROR ]
            </p>
            <p className="text-xs text-white/50 font-sans max-w-md">
              An error occurred while rendering this component.
              The rest of the application continues to function normally.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-6 text-[9px] font-mono tracking-wider uppercase text-white/40 hover:text-white/80 transition-colors border border-white/10 hover:border-white/30 px-4 py-2 rounded"
            >
              [ TRY AGAIN ]
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Specialized Error Boundary for 3D scenes
 * Shows a fallback message appropriate for WebGL/Three.js failures
 */
export function Scene3DErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-gradient-to-b from-black/10 to-black/30">
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/40 mb-3">
              3D SCENE UNAVAILABLE
            </p>
            <p className="text-xs text-white/30 font-sans max-w-sm mx-auto leading-relaxed">
              Your browser may not support WebGL, or a rendering error occurred.
              The experience continues in text mode.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
