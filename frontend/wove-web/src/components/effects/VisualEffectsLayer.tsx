import React, { useEffect, useMemo } from 'react';
import useVisualEffects, { VisualEffect } from '../../hooks/useVisualEffects';

interface VisualEffectsLayerProps {
  // This component might wrap the entire application or specific sections
  children?: React.ReactNode;
}

const VisualEffectsLayer: React.FC<VisualEffectsLayerProps> = ({ children }) => {
  const { activeEffect, clearEffect } = useVisualEffects();

  const effectStyles = useMemo(() => {
    if (!activeEffect) return {};

    switch (activeEffect.type) {
      case 'fadeIn':
        return { animation: `fadeIn ${activeEffect.duration || 1000}ms ease-out` };
      case 'fadeOut':
        return { animation: `fadeOut ${activeEffect.duration || 1000}ms ease-in forwards` };
      case 'shakeScreen':
        return {
          animation: `shake ${activeEffect.duration || 500}ms cubic-bezier(.36,.07,.19,.97) both`,
        };
      case 'colorOverlay':
        return {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: activeEffect.color || 'rgba(128, 0, 128, 0.3)', // Default purple overlay
          opacity: activeEffect.intensity || 0.3,
          pointerEvents: 'none' as React.CSSProperties['pointerEvents'], // Allow interaction with elements underneath
          zIndex: 9999, // Ensure it's on top
          transition: `opacity ${(activeEffect.duration || 1000) / 2}ms ease-in-out`,
        };
      // Add more cases for other effects like 'rain', 'fireflies' (these would likely use canvas or WebGL)
      default:
        return {};
    }
  }, [activeEffect]);

  // For effects that are not just simple CSS (like particle effects)
  useEffect(() => {
    if (activeEffect) {
      switch (activeEffect.type) {
        case 'rain':
          console.log('Starting rain effect (placeholder)', activeEffect);
          // Here you would integrate with a particle library or canvas animation
          // And clear it when effect.duration is up or clearEffect is called
          break;
        case 'fireflies':
          console.log('Starting fireflies effect (placeholder)', activeEffect);
          break;
        // No default needed as effectStyles handles simple CSS
      }
    } else {
      // Clean up any non-CSS effects
      console.log('Clearing any active non-CSS effects (placeholder)');
    }
  }, [activeEffect]);

  // This is a very simplified way to apply effects.
  // A more robust solution might use portals for overlays or a dedicated canvas layer.
  return (
    <>
      {children}
      {activeEffect &&
        (activeEffect.type === 'colorOverlay' ||
          activeEffect.type === 'fadeIn' ||
          activeEffect.type === 'fadeOut' ||
          activeEffect.type === 'shakeScreen') && (
          <div
            style={effectStyles}
            // For fadeOut, we might want to clear the effect from state once animation ends
            onAnimationEnd={() => {
              if (
                activeEffect?.type === 'fadeOut' ||
                (activeEffect?.duration && activeEffect.type !== 'colorOverlay')
              ) {
                // clearEffect(); // This might be too aggressive if effect is managed by duration in hook
              }
            }}
            aria-hidden="true" // Decorative effect
            data-oid="knjp1ay"
          />
        )}
      {/* Other effect rendering (e.g., a canvas for particle effects) could go here */}
      {/* Example: <canvas id="particle-effects-canvas" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }} /> */}

      {/* For testing: buttons to trigger effects */}
      {/* 
                <div style={{ position: 'fixed', bottom: '10px', left: '10px', zIndex: 10000, background: 'white', padding: '10px', display: 'flex', gap: '5px' }}>
                 <button onClick={() => triggerEffect({ type: 'fadeIn', duration: 500 })}>FadeIn</button>
                 <button onClick={() => triggerEffect({ type: 'fadeOut', duration: 1000 })}>FadeOut</button>
                 <button onClick={() => triggerEffect({ type: 'shakeScreen', duration: 300, intensity: 0.8 })}>Shake</button>
                 <button onClick={() => triggerEffect({ type: 'colorOverlay', color: 'rgba(255,0,0,0.2)', duration: 2000, intensity: 0.2 })}>Red Overlay</button>
                 <button onClick={() => triggerEffect({ type: 'rain', duration: 5000 })}>Rain</button>
                 <button onClick={clearEffect}>Clear</button>
                </div> 
                */}
    </>
  );
};

// Add keyframes to globals.css or a relevant stylesheet:
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
*/

export default VisualEffectsLayer;
