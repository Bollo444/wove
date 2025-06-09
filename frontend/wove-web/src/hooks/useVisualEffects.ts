import { useState, useCallback, useEffect } from 'react';

// Define possible effect types - this would be greatly expanded
export type VisualEffectType =
  | 'none'
  | 'fadeIn'
  | 'fadeOut'
  | 'shakeScreen'
  | 'colorOverlay'
  | 'rain'
  | 'fireflies';

export interface VisualEffect {
  type: VisualEffectType;
  duration?: number; // in ms
  intensity?: number; // 0-1
  color?: string; // For colorOverlay
  // Other effect-specific parameters
}

interface UseVisualEffectsReturn {
  activeEffect: VisualEffect | null;
  triggerEffect: (effect: VisualEffect) => void;
  clearEffect: () => void;
}

// This is a very basic placeholder hook.
// A real system might involve a global state, more complex effect management,
// and integration with a rendering engine or animation library.
const useVisualEffects = (): UseVisualEffectsReturn => {
  const [activeEffect, setActiveEffect] = useState<VisualEffect | null>(null);

  const triggerEffect = useCallback((effect: VisualEffect) => {
    console.log('Triggering visual effect:', effect);
    setActiveEffect(effect);

    // Auto-clear effect after duration if specified
    if (effect.duration) {
      setTimeout(() => {
        // Clear only if it's still the same effect that was triggered
        setActiveEffect(prevEffect =>
          prevEffect?.type === effect.type && prevEffect?.duration === effect.duration
            ? null
            : prevEffect,
        );
      }, effect.duration);
    }
  }, []);

  const clearEffect = useCallback(() => {
    console.log('Clearing visual effect');
    setActiveEffect(null);
  }, []);

  // Example: Listen for global effect events (e.g., from WebSocket for shared story moments)
  // useEffect(() => {
  //   const handleGlobalEffect = (event: CustomEvent<VisualEffect>) => {
  //     triggerEffect(event.detail);
  //   };
  //   window.addEventListener('global-visual-effect', handleGlobalEffect as EventListener);
  //   return () => {
  //     window.removeEventListener('global-visual-effect', handleGlobalEffect as EventListener);
  //   };
  // }, [triggerEffect]);

  return { activeEffect, triggerEffect, clearEffect };
};

export default useVisualEffects;
