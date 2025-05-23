import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getAnimationConfig } from './cleanAnimationConfig';

// Register the useGSAP hook
gsap.registerPlugin(useGSAP);

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
    lineHeight?: string;
  };
}

interface CleanSharedElementPortalProps {
  children: React.ReactNode;
  sourceElement: HTMLElement | null;
  targetElement: HTMLElement | null;
  isActive: boolean;
  onAnimationComplete: () => void;
  duration?: number;
  easing?: string;
}

/**
 * Clean shared element animation using useGSAP and Context7 best practices
 */
const CleanSharedElementPortal: React.FC<CleanSharedElementPortalProps> = ({
  children,
  sourceElement,
  targetElement,
  isActive,
  onAnimationComplete,
  duration = 0.45,
  easing = 'power3.out'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [sourceMeasurements, setSourceMeasurements] = useState<ElementMeasurements | null>(null);
  const [targetMeasurements, setTargetMeasurements] = useState<ElementMeasurements | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Get animation config for fade out timing
  const animConfig = getAnimationConfig();

  // Create stable portal container
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    let container = document.getElementById('clean-animation-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'clean-animation-portal';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    return () => {
      setPortalContainer(null);
    };
  }, []);

  // Measure elements when active
  useEffect(() => {
    if (!isActive || !sourceElement || !targetElement) {
      setSourceMeasurements(null);
      setTargetMeasurements(null);
      setIsReady(false);
      return;
    }

    const measureElements = () => {
      try {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        if (sourceRect.width === 0 || sourceRect.height === 0 || 
            targetRect.width === 0 || targetRect.height === 0) {
          return false;
        }

        const sourceStyles = window.getComputedStyle(sourceElement);
        const targetStyles = window.getComputedStyle(targetElement);

        setSourceMeasurements({
          rect: sourceRect,
          styles: {
            backgroundColor: sourceStyles.backgroundColor,
            color: sourceStyles.color,
            borderRadius: sourceStyles.borderRadius,
            fontFamily: sourceStyles.fontFamily,
            fontSize: sourceStyles.fontSize,
            fontWeight: sourceStyles.fontWeight,
            padding: sourceStyles.padding,
            lineHeight: sourceStyles.lineHeight,
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
            padding: targetStyles.padding,
          }
        });

        return true;
      } catch (error) {
        return false;
      }
    };

    // Use RAF to ensure DOM is ready
    requestAnimationFrame(() => {
      if (measureElements()) {
        setIsReady(true);
      } else {
        // Retry with a small delay
        setTimeout(() => {
          requestAnimationFrame(() => {
            if (measureElements()) {
              setIsReady(true);
            } else {
              onAnimationComplete();
            }
          });
        }, 50);
      }
    });

    return () => {
      setIsReady(false);
    };
  }, [isActive, sourceElement, targetElement, onAnimationComplete]);

  // useGSAP for animation management
  const { contextSafe } = useGSAP({
    scope: containerRef,
    dependencies: [isReady, sourceMeasurements, targetMeasurements],
    revertOnUpdate: true
  });

  // Start animation when ready
  useEffect(() => {
    if (!isReady || !containerRef.current || !sourceMeasurements || !targetMeasurements) {
      return;
    }

    const runAnimation = contextSafe(() => {
      if (!containerRef.current) return;

      // Set initial state
      gsap.set(containerRef.current, {
        position: 'fixed',
        left: sourceMeasurements.rect.left,
        top: sourceMeasurements.rect.top,
        width: 'auto', // Let content determine width
        height: 'auto', // Let content determine height
        backgroundColor: 'transparent', // No background needed for text
        color: sourceMeasurements.styles.color,
        fontFamily: sourceMeasurements.styles.fontFamily,
        fontSize: sourceMeasurements.styles.fontSize,
        fontWeight: sourceMeasurements.styles.fontWeight,
        lineHeight: sourceMeasurements.styles.lineHeight || '1.4',
        opacity: 1,
        zIndex: 9999,
        pointerEvents: 'none'
      });

      // Create a timeline for better control
      const tl = gsap.timeline();

      // Main animation to target
      tl.to(containerRef.current, {
        left: targetMeasurements.rect.left,
        top: targetMeasurements.rect.top,
        color: targetMeasurements.styles.color,
        fontFamily: targetMeasurements.styles.fontFamily,
        fontSize: targetMeasurements.styles.fontSize,
        fontWeight: targetMeasurements.styles.fontWeight,
        lineHeight: targetMeasurements.styles.lineHeight || '1.4',
        duration,
        ease: easing,
        onComplete: () => {
          // Call completion as soon as element reaches destination
          onAnimationComplete();
        }
      }, 0);

      // Fade out with proper timing - after modal content is visible
      tl.to(containerRef.current, {
        opacity: 0,
        duration: animConfig.sharedElement.fadeOutDuration,
        ease: 'power2.out',
      }, duration + Math.abs(animConfig.sharedElement.fadeOutOffset)); // Start fade out after main animation plus offset
    });

    runAnimation();
  }, [isReady, sourceMeasurements, targetMeasurements, duration, easing, onAnimationComplete, contextSafe]);

  if (!isActive || !portalContainer || !isReady || !sourceMeasurements) {
    return null;
  }

  return createPortal(
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        boxSizing: 'border-box',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        zIndex: 9999,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>,
    portalContainer
  );
};

export default CleanSharedElementPortal; 