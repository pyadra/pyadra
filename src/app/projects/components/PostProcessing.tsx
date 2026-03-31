import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

/**
 * Post-processing effects for cinematic quality
 * Bloom makes emissive materials glow beautifully
 * Vignette adds atmospheric focus
 */
export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Subtle bloom - mystical not bright */}
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        kernelSize={KernelSize.MEDIUM}
        mipmapBlur
      />

      {/* Vignette for focus */}
      <Vignette
        offset={0.25}
        darkness={0.6}
        eskil={false}
      />
    </EffectComposer>
  );
}
