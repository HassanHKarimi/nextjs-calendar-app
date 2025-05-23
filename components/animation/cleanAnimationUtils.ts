import gsap from 'gsap';

/**
 * Clean animation utilities following Context7 best practices
 */

export interface AnimationOptions {
  duration?: number;
  ease?: string;
  onComplete?: () => void;
  delay?: number;
}

/**
 * Simple fade in animation
 */
export const fadeIn = (
  element: HTMLElement,
  options: AnimationOptions = {}
): (() => void) => {
  const {
    duration = 0.3,
    ease = 'power2.out',
    onComplete,
    delay = 0
  } = options;

  // Create context for cleanup
  const ctx = gsap.context(() => {
    gsap.fromTo(element, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration,
        ease,
        delay,
        onComplete
      }
    );
  });

  // Return cleanup function
  return () => ctx.revert();
};

/**
 * Simple fade out animation
 */
export const fadeOut = (
  element: HTMLElement,
  options: AnimationOptions = {}
): (() => void) => {
  const {
    duration = 0.3,
    ease = 'power2.out',
    onComplete,
    delay = 0
  } = options;

  const ctx = gsap.context(() => {
    gsap.to(element, {
      opacity: 0,
      duration,
      ease,
      delay,
      onComplete
    });
  });

  return () => ctx.revert();
};

/**
 * Scale up animation (entrance)
 */
export const scaleIn = (
  element: HTMLElement,
  options: AnimationOptions = {}
): (() => void) => {
  const {
    duration = 0.3,
    ease = 'back.out(1.7)',
    onComplete,
    delay = 0
  } = options;

  const ctx = gsap.context(() => {
    gsap.fromTo(element,
      { 
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete
      }
    );
  });

  return () => ctx.revert();
};

/**
 * Slide up animation
 */
export const slideUp = (
  element: HTMLElement,
  options: AnimationOptions = {}
): (() => void) => {
  const {
    duration = 0.3,
    ease = 'power2.out',
    onComplete,
    delay = 0
  } = options;

  const ctx = gsap.context(() => {
    gsap.fromTo(element,
      { 
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete
      }
    );
  });

  return () => ctx.revert();
};

/**
 * Stagger animation for multiple elements
 */
export const staggerIn = (
  elements: HTMLElement[],
  options: AnimationOptions & { stagger?: number } = {}
): (() => void) => {
  const {
    duration = 0.3,
    ease = 'power2.out',
    onComplete,
    delay = 0,
    stagger = 0.1
  } = options;

  const ctx = gsap.context(() => {
    gsap.fromTo(elements,
      { 
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration,
        ease,
        delay,
        stagger,
        onComplete
      }
    );
  });

  return () => ctx.revert();
};

/**
 * Create a timeline for complex animations
 */
export const createTimeline = (): gsap.core.Timeline => {
  return gsap.timeline();
};

/**
 * Clean up all GSAP animations in a context
 */
export const killAllAnimations = (context?: gsap.Context): void => {
  if (context) {
    context.revert();
  } else {
    gsap.killTweensOf('*');
  }
}; 