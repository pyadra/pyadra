import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Global activation state manager
 * Prevents multiple artifacts from activating simultaneously
 * States: idle | detected | awakened | activating | transitioning
 */

export type ActivationState = 'idle' | 'detected' | 'awakened' | 'activating' | 'transitioning';

interface ActivationContextType {
  activeArtifact: string | null;
  state: ActivationState;
  setActivating: (artifactId: string) => void;
  setTransitioning: () => void;
  reset: () => void;
  canActivate: (artifactId: string) => boolean;
}

const ActivationContext = createContext<ActivationContextType | undefined>(undefined);

export function ActivationProvider({ children }: { children: ReactNode }) {
  const [activeArtifact, setActiveArtifact] = useState<string | null>(null);
  const [state, setState] = useState<ActivationState>('idle');

  const setActivating = useCallback((artifactId: string) => {
    if (state === 'idle' || state === 'detected' || state === 'awakened') {
      setActiveArtifact(artifactId);
      setState('activating');
    }
  }, [state]);

  const setTransitioning = useCallback(() => {
    setState('transitioning');
  }, []);

  const reset = useCallback(() => {
    setActiveArtifact(null);
    setState('idle');
  }, []);

  const canActivate = useCallback((artifactId: string) => {
    return activeArtifact === null || activeArtifact === artifactId;
  }, [activeArtifact]);

  return (
    <ActivationContext.Provider
      value={{
        activeArtifact,
        state,
        setActivating,
        setTransitioning,
        reset,
        canActivate,
      }}
    >
      {children}
    </ActivationContext.Provider>
  );
}

export function useActivationState() {
  const context = useContext(ActivationContext);
  if (!context) {
    throw new Error('useActivationState must be used within ActivationProvider');
  }
  return context;
}
