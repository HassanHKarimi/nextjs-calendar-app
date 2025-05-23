import gsap from 'gsap';

interface AnimationOptions {
  duration?: number;
  ease?: string;
  onComplete?: () => void;
}

/**
 * Animates a shared element transition between a source and target element
 */
export const animateSharedElement = (
  sourceElement: HTMLElement,
  targetElement: HTMLElement,
  options: AnimationOptions = {}
) => {
  if (!sourceElement || !targetElement) {
    console.error('Missing source or target element for animation');
    return null;
  }

  const {
    duration = 0.2,
    ease = 'power2.out',
    onComplete
  } = options;

  // Get positions and dimensions
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  // Create a clone of the source element
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  
  // Position the clone at the source position
  gsap.set(clone, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: sourceRect.width,
    height: sourceRect.height,
    transform: `translate(${sourceRect.left}px, ${sourceRect.top}px)`,
    zIndex: 9999,
    margin: 0,
    padding: sourceElement.style.padding || '0',
    background: getComputedStyle(sourceElement).backgroundColor,
    color: getComputedStyle(sourceElement).color,
    borderRadius: getComputedStyle(sourceElement).borderRadius,
    fontFamily: getComputedStyle(sourceElement).fontFamily,
    fontSize: getComputedStyle(sourceElement).fontSize,
    fontWeight: getComputedStyle(sourceElement).fontWeight,
  });

  // Append the clone to the body
  document.body.appendChild(clone);

  // Create animation context for cleanup
  const context = gsap.context(() => {
    // Animate the clone to the target position
    gsap.to(clone, {
      x: targetRect.left,
      y: targetRect.top,
      width: targetRect.width,
      height: targetRect.height,
      duration,
      ease,
      onComplete: () => {
        // Remove the clone after animation completes
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
      }
    });
  });

  return {
    cleanup: () => {
      context.revert(); // Cleanup all animations created in this context
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }
  };
};

/**
 * Fades in an element
 */
export const fadeIn = (
  element: HTMLElement,
  duration: number = 0.1,
  delay: number = 0,
  onComplete?: () => void
) => {
  if (!element) return null;
  
  gsap.set(element, { opacity: 0 });
  
  const context = gsap.context(() => {
    gsap.to(element, {
      opacity: 1,
      duration,
      delay,
      onComplete
    });
  });

  return {
    cleanup: () => context.revert()
  };
}; 