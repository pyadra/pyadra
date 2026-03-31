import { useState, useCallback } from 'react';

/**
 * Clean state management for artifacts
 * States: buried → detected → awakened
 */

export type ArtifactState = 'buried' | 'detected' | 'awakened';

export function useArtifactState(initialState: ArtifactState = 'buried') {
  const [state, setState] = useState<ArtifactState>(initialState);

  const detect = useCallback(() => {
    if (state === 'buried') {
      setState('detected');
    }
  }, [state]);

  const undetect = useCallback(() => {
    if (state === 'detected') {
      setState('buried');
    }
  }, [state]);

  const awaken = useCallback(() => {
    if (state === 'detected') {
      setState('awakened');
    }
  }, [state]);

  return {
    state,
    detect,
    undetect,
    awaken,
    isBuried: state === 'buried',
    isDetected: state === 'detected',
    isAwakened: state === 'awakened',
  };
}
