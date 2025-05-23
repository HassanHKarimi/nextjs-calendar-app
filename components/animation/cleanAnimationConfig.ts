/**
 * Centralized animation configuration for consistent timing and easing
 * Following Context7 best practices for animation coordination
 */

export const ANIMATION_CONFIG = {
  // Shared element animation
  sharedElement: {
    duration: 0.45,
    easing: 'power3.out',
    fadeOutDuration: 0.15,
    fadeOutOffset: -0.05, // Start fade out 0.05s before animation completes (modal title shows first)
  },
  
  // Modal content animations
  modal: {
    overlay: {
      duration: 0.25,
      easing: 'power2.out',
      delay: 0,
    },
    content: {
      duration: 0.35,
      easing: 'power2.out',
      delay: 0.08, // Start after shared element begins fading
      scale: {
        from: 0.96,
        to: 1,
      },
      translate: {
        from: 15,
        to: 0,
      },
    },
  },
  
  // Utility animations
  utils: {
    fadeIn: {
      duration: 0.3,
      easing: 'power2.out',
    },
    fadeOut: {
      duration: 0.2,
      easing: 'power2.in',
    },
    scaleIn: {
      duration: 0.3,
      easing: 'back.out(1.7)',
    },
    slideUp: {
      duration: 0.3,
      easing: 'power2.out',
    },
    stagger: {
      duration: 0.3,
      easing: 'power2.out',
      delay: 0.1,
    },
  },
  
  // Motion preferences
  reducedMotion: {
    duration: 0.01, // Near-instant for users who prefer reduced motion
    easing: 'none',
  },
};

/**
 * Get animation config based on user's motion preferences
 */
export const getAnimationConfig = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return {
        ...ANIMATION_CONFIG,
        sharedElement: { ...ANIMATION_CONFIG.sharedElement, ...ANIMATION_CONFIG.reducedMotion },
        modal: {
          overlay: { ...ANIMATION_CONFIG.modal.overlay, ...ANIMATION_CONFIG.reducedMotion },
          content: { ...ANIMATION_CONFIG.modal.content, ...ANIMATION_CONFIG.reducedMotion },
        },
      };
    }
  }
  return ANIMATION_CONFIG;
}; 