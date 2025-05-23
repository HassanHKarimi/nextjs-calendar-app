import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

// Debug flag - set to true to enable debugging features
const DEBUG = false;

// Measurement types
interface ElementMeasurements {
  rect: DOMRect;
  styles: {
    backgroundColor: string;
    color: string;
    borderRadius: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
  };
}

interface SharedElementPortalProps {
  children: React.ReactNode;
  sourceElement: HTMLElement | null;
  targetElement: HTMLElement | null; 
  isActive: boolean;
  onAnimationComplete: () => void;
  duration?: number;
  debug?: boolean;
  easing?: string;
}

/**
 * A React Portal-based shared element animation component
 * Following Context7 best practices for animations in React
 */
const SharedElementPortal: React.FC<SharedElementPortalProps> = ({
  children,
  sourceElement,
  targetElement,
  isActive,
  onAnimationComplete,
  duration = 0.3,
  debug = DEBUG,
  easing = 'power2.out'
}) => {
  // Animation container ref and state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.Context | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [sourceMeasurements, setSourceMeasurements] = useState<ElementMeasurements | null>(null);
  const [targetMeasurements, setTargetMeasurements] = useState<ElementMeasurements | null>(null);
  const measurementAttempts = useRef(0);
  
  // Create portal container once on mount - Context7 pattern for stable portal DOM node
  useEffect(() => {
    if (typeof document === 'undefined') return;

    try {
      // Create or find the animation container
      let container = document.getElementById('animation-portal-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'animation-portal-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        container.style.overflow = 'hidden';
        
        if (debug) {
          console.log('[SharedElementPortal] Creating portal container');
          container.style.border = '2px solid red';
        }
        
        document.body.appendChild(container);
      }
      
      setPortalContainer(container);
    } catch (error) {
      console.error('[SharedElementPortal] Error creating portal container:', error);
    }
    
    // Cleanup function
    return () => {
      // Don't remove the container, as it might be used by other animations
      // Just clear our internal reference
      setPortalContainer(null);
    };
  }, [debug]);
  
  // Context7-compliant function to get measurements with safety checks
  const getMeasurements = () => {
    if (!sourceElement || !targetElement) {
      console.warn('[SharedElementPortal] Missing source or target element');
      return false;
    }
    
    // Context7: Validate element connection to DOM
    if (!document.body.contains(sourceElement)) {
      console.warn('[SharedElementPortal] Source element not in DOM');
      return false;
    }
    
    if (!document.body.contains(targetElement)) {
      console.warn('[SharedElementPortal] Target element not in DOM');
      return false;
    }
    
    try {
      // Get source measurements
      const sourceRect = sourceElement.getBoundingClientRect();
      const sourceStyles = window.getComputedStyle(sourceElement);
      
      // Skip if source has zero size (likely not rendered yet)
      if (sourceRect.width === 0 || sourceRect.height === 0) {
        if (debug) console.log('[SharedElementPortal] Source element has zero size, retrying...');
        return false;
      }
      
      // Get target measurements
      const targetRect = targetElement.getBoundingClientRect();
      const targetStyles = window.getComputedStyle(targetElement);
      
      // Skip if target has zero size (likely not rendered yet)
      if (targetRect.width === 0 || targetRect.height === 0 || 
          (targetRect.top === 0 && targetRect.left === 0)) {
        if (debug) console.log('[SharedElementPortal] Target element has zero size or position, retrying...',
          { rect: targetRect, element: targetElement, styles: targetStyles });
        return false;
      }
      
      // Verify target is on screen
      if (targetRect.top < 0 || targetRect.left < 0 || 
          targetRect.right > window.innerWidth || targetRect.bottom > window.innerHeight) {
        if (debug) console.log('[SharedElementPortal] Target element is offscreen, using safe position');
        // Use center of screen as fallback - Context7 pattern for safe positioning
        const safeRect = new DOMRect(
          window.innerWidth / 2 - targetRect.width / 2,
          window.innerHeight / 2 - targetRect.height / 2,
          targetRect.width,
          targetRect.height
        );
        
        setSourceMeasurements({
          rect: sourceRect,
          styles: {
            backgroundColor: sourceStyles.backgroundColor,
            color: sourceStyles.color,
            borderRadius: sourceStyles.borderRadius,
            fontFamily: sourceStyles.fontFamily,
            fontSize: sourceStyles.fontSize,
            fontWeight: sourceStyles.fontWeight,
            padding: sourceStyles.padding
          }
        });
        
        setTargetMeasurements({
          rect: safeRect,
          styles: {
            backgroundColor: targetStyles.backgroundColor,
            color: targetStyles.color,
            borderRadius: targetStyles.borderRadius,
            fontFamily: targetStyles.fontFamily,
            fontSize: targetStyles.fontSize,
            fontWeight: targetStyles.fontWeight,
            padding: targetStyles.padding
          }
        });
      } else {
        // Normal case - both source and target are valid
        setSourceMeasurements({
          rect: sourceRect,
          styles: {
            backgroundColor: sourceStyles.backgroundColor,
            color: sourceStyles.color,
            borderRadius: sourceStyles.borderRadius,
            fontFamily: sourceStyles.fontFamily,
            fontSize: sourceStyles.fontSize,
            fontWeight: sourceStyles.fontWeight,
            padding: sourceStyles.padding
          }
        });
        
        setTargetMeasurements({
          rect: targetRect,
          styles: {
            backgroundColor: targetStyles.backgroundColor,
            color: targetStyles.color,
            borderRadius: targetStyles.borderRadius,
            fontFamily: targetStyles.fontFamily,
            fontSize: targetStyles.fontSize,
            fontWeight: targetStyles.fontWeight,
            padding: targetStyles.padding
          }
        });
      }
      
      if (debug) {
        console.log('[SharedElementPortal] Measurements complete', {
          sourceRect,
          targetRect
        });
      }
      
      return true;
    } catch (error) {
      console.error('[SharedElementPortal] Error measuring elements', error);
      return false;
    }
  };
  
  // Context7 pattern: Deferred measurements with increasing delay
  useEffect(() => {
    if (!isActive || !sourceElement || !targetElement) return;
    
    if (debug) {
      console.log('[SharedElementPortal] Measuring elements', { 
        sourceElement, 
        targetElement,
        sourceId: sourceElement.getAttribute('data-id') || sourceElement.id,
        targetId: targetElement.getAttribute('data-id') || targetElement.id
      });
    }
    
    // Force layout before measuring
    document.body.offsetHeight;
    
    // Context7: Ensure layout is complete with RAF before measuring
    requestAnimationFrame(() => {
      // Force another layout calculation
      document.body.offsetHeight;
      
      // Try measuring with nested RAF for maximum reliability
      requestAnimationFrame(() => {
        // Try measuring immediately after two RAF cycles
        if (getMeasurements()) {
          return; // Got measurements on first try
        }
        
        // If not successful, try again with increasing delays - Context7 pattern for reliable measurements
        const attemptMeasurement = () => {
          measurementAttempts.current += 1;
          
          if (measurementAttempts.current > 10) { // Increased max attempts
            console.error('[SharedElementPortal] Failed to get valid measurements after multiple attempts');
            // Call animation complete to not block the UI
            onAnimationComplete();
            return;
          }
          
          if (getMeasurements()) {
            if (debug) console.log(`[SharedElementPortal] Successful measurement on attempt ${measurementAttempts.current}`);
            return;
          }
          
          // Try again with increasing delay - capped at 100ms max
          const delay = Math.min(100, 20 * measurementAttempts.current);
          setTimeout(() => {
            // Force layout recalculation before each attempt
            document.body.offsetHeight;
            requestAnimationFrame(attemptMeasurement);
          }, delay);
        };
        
        // Start attempts with a small initial delay
        setTimeout(attemptMeasurement, 30);
      });
    });
    
    return () => {
      measurementAttempts.current = 0;
    };
  }, [isActive, sourceElement, targetElement, debug, onAnimationComplete]);
  
  // Context7 pattern: Animation with safe defaults and retries
  useEffect(() => {
    if (!isActive || !containerRef.current || !sourceMeasurements || !targetMeasurements) {
      return;
    }
    
    if (debug) {
      console.log('[SharedElementPortal] Starting animation', {
        source: sourceMeasurements,
        target: targetMeasurements,
        container: containerRef.current,
        duration,
        easing
      });
    }

    try {
      // Create animation context for cleanup - Context7 pattern
      const ctx = gsap.context(() => {
        // Set initial position and styles to match source
        gsap.set(containerRef.current, {
          position: 'fixed', // Changed to fixed for reliable positioning
          x: sourceMeasurements.rect.left,
          y: sourceMeasurements.rect.top,
          width: sourceMeasurements.rect.width,
          height: sourceMeasurements.rect.height,
          backgroundColor: sourceMeasurements.styles.backgroundColor,
          color: sourceMeasurements.styles.color,
          borderRadius: sourceMeasurements.styles.borderRadius,
          fontFamily: sourceMeasurements.styles.fontFamily,
          fontSize: sourceMeasurements.styles.fontSize,
          fontWeight: sourceMeasurements.styles.fontWeight,
          padding: sourceMeasurements.styles.padding,
          opacity: 1,
          overwrite: true
        });
        
        // Force a browser repaint before animation - Context7 pattern for reliable animation
        if (containerRef.current) {
          containerRef.current.offsetHeight;
        }
        
        // Context7: Double RAF for maximum reliability
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (debug) {
              console.log('[SharedElementPortal] Animation frame, starting GSAP animation');
            }
            
            // Ensure containerRef is still available
            if (!containerRef.current) {
              console.error('[SharedElementPortal] Container ref lost before animation');
              onAnimationComplete();
              return;
            }
            
            // Double-check target position before animation
            let finalTargetX = targetMeasurements.rect.left;
            let finalTargetY = targetMeasurements.rect.top;
            
            if (targetElement && document.body.contains(targetElement)) {
              // Re-measure target position one last time for accuracy
              const currentTargetRect = targetElement.getBoundingClientRect();
              if (currentTargetRect.width > 0 && currentTargetRect.height > 0) {
                finalTargetX = currentTargetRect.left;
                finalTargetY = currentTargetRect.top;
                
                if (debug) {
                  console.log('[SharedElementPortal] Updated target position:', {
                    original: { x: targetMeasurements.rect.left, y: targetMeasurements.rect.top },
                    updated: { x: finalTargetX, y: finalTargetY }
                  });
                }
              }
            }
            
            // Context7: Safe animation with fallbacks
            gsap.to(containerRef.current, {
              x: finalTargetX,
              y: finalTargetY,
              width: targetMeasurements.rect.width,
              height: targetMeasurements.rect.height,
              backgroundColor: targetMeasurements.styles.backgroundColor,
              color: targetMeasurements.styles.color,
              borderRadius: targetMeasurements.styles.borderRadius,
              fontFamily: targetMeasurements.styles.fontFamily,
              fontSize: targetMeasurements.styles.fontSize,
              fontWeight: targetMeasurements.styles.fontWeight,
              duration: debug ? (duration * 1.5) : duration, // Slow down in debug mode
              ease: easing,
              onUpdate: function() {
                // Context7: Mid-animation position correction - update destination if target moves
                if (this.progress() > 0.5 && targetElement && document.body.contains(targetElement)) {
                  const updatedRect = targetElement.getBoundingClientRect();
                  if (Math.abs(updatedRect.left - finalTargetX) > 5 || 
                      Math.abs(updatedRect.top - finalTargetY) > 5) {
                    // Target moved during animation, update destination
                    finalTargetX = updatedRect.left;
                    finalTargetY = updatedRect.top;
                    gsap.to(containerRef.current, {
                      x: finalTargetX,
                      y: finalTargetY,
                      duration: debug ? duration : duration / 2,
                      overwrite: false
                    });
                    
                    if (debug) {
                      console.log('[SharedElementPortal] Target moved mid-animation, correcting:', {
                        x: finalTargetX,
                        y: finalTargetY
                      });
                    }
                  }
                }
              },
              // Add a slight bounce effect at the end to make arrival more noticeable
              onComplete: () => {
                // Optional bounce effect to signal arrival
                if (containerRef.current) {
                  gsap.to(containerRef.current, {
                    scale: 1.02, 
                    duration: 0.1,
                    onComplete: () => {
                      gsap.to(containerRef.current, {
                        scale: 1,
                        opacity: 0,
                        duration: 0.1,
                        onComplete: () => {
                          if (debug) {
                            console.log('[SharedElementPortal] Animation complete with subtle bounce effect');
                          }
                          onAnimationComplete();
                        }
                      });
                    }
                  });
                } else {
                  if (debug) {
                    console.log('[SharedElementPortal] Animation complete');
                  }
                  onAnimationComplete();
                }
              }
            });
          });
        });
      });
      
      // Store the context for cleanup
      animationRef.current = ctx;
    } catch (error) {
      console.error('[SharedElementPortal] Animation error:', error);
      onAnimationComplete(); // Ensure UI isn't blocked
    }
    
    // Cleanup function - Context7 pattern for proper cleanup
    return () => {
      if (animationRef.current) {
        if (debug) {
          console.log('[SharedElementPortal] Cleaning up animation');
        }
        animationRef.current.revert(); // This kills all animations created in this context
        animationRef.current = null;
      }
    };
  }, [isActive, sourceMeasurements, targetMeasurements, duration, debug, onAnimationComplete, targetElement, easing]);
  
  // Don't render anything if not active or missing elements
  if (!isActive || !portalContainer || !sourceMeasurements) {
    if (debug) {
      console.log('[SharedElementPortal] Not rendering', { 
        isActive, 
        hasPortalContainer: !!portalContainer,
        hasSourceMeasurements: !!sourceMeasurements
      });
    }
    return null;
  }
  
  // Context7: Render with proper defaults and fallbacks
  return createPortal(
    <div 
      ref={containerRef}
      className="shared-element-animation"
      style={{
        position: 'fixed', // Changed to fixed for reliable positioning
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 9999, // Ensure high z-index
        willChange: 'transform, opacity', // Better animation performance
        ...(debug ? { 
          border: '2px solid blue',
          zIndex: 10000 
        } : {})
      }}
      data-portal="shared-element"
    >
      {children}
    </div>,
    portalContainer
  );
};

export default SharedElementPortal;