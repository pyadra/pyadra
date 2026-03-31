/**
 * Minimal lighting setup for dark excavation environment
 * Low ambient light to maintain mystery and cinematic mood
 * Artifacts have internal point lights for visibility
 */
export function LightingRig() {
  return (
    <>
      {/* Low ambient - dark cinematic mood */}
      <ambientLight intensity={0.2} color="#9a8070" />

      {/* Subtle main light from above */}
      <directionalLight
        position={[0, 15, 10]}
        intensity={0.4}
        color="#b09080"
      />

      {/* Subtle left fill light */}
      <directionalLight
        position={[-10, 8, 0]}
        intensity={0.3}
        color="#a08870"
      />

      {/* Subtle right fill light */}
      <directionalLight
        position={[10, 8, 0]}
        intensity={0.3}
        color="#a08870"
      />
    </>
  );
}
