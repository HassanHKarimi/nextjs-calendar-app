// ARCHIVE: This file is being archived for reference. See modalTitleSharedElement.ARCHIVE.ts for the previous diagnostic version.

import gsap from 'gsap';

/**
 * Get the animation layer element or fall back to document.body
 * Only runs on client side
 */
function getAnimationLayer(): HTMLElement | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  
  // Try to get the existing animation layer
  const layer = document.getElementById('animation-layer');
  
  // If layer doesn't exist, create it dynamically
  if (!layer && document.body) {
    console.log('[SharedElement] Creating animation layer dynamically');
    const animLayer = document.createElement('div');
    animLayer.id = 'animation-layer';
    animLayer.style.position = 'fixed';
    animLayer.style.pointerEvents = 'none';
    animLayer.style.zIndex = '2147483647';
    animLayer.style.top = '0';
    animLayer.style.left = '0';
    animLayer.style.width = '100%';
    animLayer.style.height = '100%';
    animLayer.style.overflow = 'hidden';
    document.body.appendChild(animLayer);
    return animLayer;
  }
  
  return layer || document.body;
}

/**
 * Animate a shared element transition for the modal title.
 * @param sourceNode The DOM node of the event title in the calendar
 * @param targetNode The DOM node of the modal title
 * @param options Optional: duration, onComplete callback
 */
export function animateModalTitleSharedElement(
  sourceNode: HTMLElement | null,
  targetNode: HTMLElement | null,
  options?: {
    duration?: number;
    onComplete?: () => void;
  }
) {
  // Ensure we're running on client side
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.log('[SharedElement] Not in browser environment, skipping animation');
    if (options?.onComplete) options.onComplete();
    return;
  }
  
  // Verify nodes exist
  if (!sourceNode || !targetNode) {
    console.error('[SharedElement] Missing nodes', { sourceNode, targetNode });
    if (options?.onComplete) options.onComplete();
    return;
  }

  try {
    // Get element positions
    const sourceRect = sourceNode.getBoundingClientRect();
    const targetRect = targetNode.getBoundingClientRect();
    const duration = options?.duration || 400;
    
    // Detailed position logging for debugging
    console.log('[SharedElement] Animation setup', { 
      sourceRect, 
      targetRect, 
      sourcePosition: `left: ${sourceRect.left}, top: ${sourceRect.top}`,
      targetPosition: `left: ${targetRect.left}, top: ${targetRect.top}`,
      sourceText: sourceNode.textContent,
      targetText: targetNode.textContent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    });

    // Check if target rect is valid (visible in viewport)
    if (targetRect.width === 0 || targetRect.height === 0 || 
        targetRect.left < -1000 || targetRect.left > window.innerWidth + 1000 || 
        targetRect.top < -1000 || targetRect.top > window.innerHeight + 1000) {
      console.warn('[SharedElement] Target rect is invalid or far outside viewport', targetRect);
      
      // Use center of viewport as fallback position
      const fallbackLeft = window.innerWidth / 2 - sourceRect.width / 2;
      const fallbackTop = window.innerHeight / 2 - 100; // 100px from top
      
      console.log('[SharedElement] Using fallback position', { fallbackLeft, fallbackTop });
      
      // Get animation layer
      const animationLayer = getAnimationLayer();
      if (!animationLayer) {
        console.error('[SharedElement] Animation layer not available');
        if (options?.onComplete) options.onComplete();
        return;
      }
      
      // Hide the target node during animation
      gsap.set(targetNode, { autoAlpha: 0 });
      
      // Create animation wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'shared-element-wrapper';
      wrapper.style.position = 'fixed';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.zIndex = '9999';
      wrapper.style.left = '0';
      wrapper.style.top = '0';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      
      // Create clone
      const clone = document.createElement('div');
      clone.className = 'shared-element-clone';
      clone.textContent = sourceNode.textContent;
      clone.id = `clone-${Date.now()}`;
      
      // Style the clone with source element properties
      const sourceStyles = window.getComputedStyle(sourceNode);
      
      // Position and style the clone
      clone.style.position = 'absolute';
      clone.style.left = `${sourceRect.left}px`;
      clone.style.top = `${sourceRect.top}px`;
      clone.style.width = `${sourceRect.width}px`;
      clone.style.height = `${sourceRect.height}px`;
      clone.style.backgroundColor = sourceStyles.backgroundColor;
      clone.style.color = sourceStyles.color;
      clone.style.fontFamily = sourceStyles.fontFamily;
      clone.style.fontSize = sourceStyles.fontSize;
      clone.style.fontWeight = sourceStyles.fontWeight;
      clone.style.lineHeight = sourceStyles.lineHeight;
      clone.style.padding = sourceStyles.padding;
      clone.style.margin = '0';
      clone.style.border = '2px solid rgba(0,0,255,0.2)';
      clone.style.boxSizing = 'border-box';
      clone.style.display = 'flex';
      clone.style.alignItems = 'center';
      clone.style.justifyContent = 'center';
      clone.style.borderRadius = sourceStyles.borderRadius;
      clone.style.overflow = 'hidden';
      clone.style.whiteSpace = 'nowrap';
      clone.style.textOverflow = 'ellipsis';
      clone.style.opacity = '1';
      clone.style.visibility = 'visible';
      
      // Add clone to wrapper and wrapper to animation layer
      wrapper.appendChild(clone);
      animationLayer.appendChild(wrapper);
      
      console.log('[SharedElement] Using fallback animation to center of screen');
      
      // Force layout calculation
      void clone.offsetHeight;
      
      // Animate to fallback center position
      gsap.to(clone, {
        left: fallbackLeft,
        top: fallbackTop,
        width: sourceRect.width * 1.5, // Little wider for title
        duration: duration / 1000,
        ease: "power3.inOut",
        opacity: 0.2,
        onComplete: () => {
          // Show the real target
          gsap.to(targetNode, { 
            autoAlpha: 1, 
            duration: 0.1 
          });
          
          // Clean up
          setTimeout(() => {
            if (wrapper.parentNode === animationLayer) {
              animationLayer.removeChild(wrapper);
              console.log('[SharedElement] Fallback animation complete');
            }
            
            if (options?.onComplete) {
              options.onComplete();
            }
          }, 50);
        }
      });
      
      return;
    }

    // Get animation layer
    const animationLayer = getAnimationLayer();
    if (!animationLayer) {
      console.error('[SharedElement] Animation layer not available');
      if (options?.onComplete) options.onComplete();
      return;
    }

    // Hide the target node during animation
    gsap.set(targetNode, { 
      autoAlpha: 0 
    });
    
    // Create a wrapper element for the animation
    const wrapper = document.createElement('div');
    wrapper.className = 'shared-element-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.zIndex = '9999';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    
    // Create a clone element for animation
    const clone = document.createElement('div');
    clone.className = 'shared-element-clone';
    clone.textContent = sourceNode.textContent;
    clone.id = `clone-${Date.now()}`;
    
    // Copy computed styles from source to clone
    const sourceStyles = window.getComputedStyle(sourceNode);
    
    // Begin with absolute positioning at the source location
    clone.style.position = 'absolute';
    clone.style.left = `${sourceRect.left}px`;
    clone.style.top = `${sourceRect.top}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    
    // Copy visual styles but ensure visibility
    clone.style.backgroundColor = sourceStyles.backgroundColor;
    clone.style.color = sourceStyles.color;
    clone.style.fontFamily = sourceStyles.fontFamily;
    clone.style.fontSize = sourceStyles.fontSize;
    clone.style.fontWeight = sourceStyles.fontWeight;
    clone.style.lineHeight = sourceStyles.lineHeight;
    clone.style.padding = sourceStyles.padding;
    clone.style.margin = '0'; // Reset margin
    clone.style.border = '2px solid rgba(0,0,255,0.2)'; // Debug border
    clone.style.boxSizing = 'border-box';
    clone.style.display = 'flex';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.borderRadius = sourceStyles.borderRadius;
    clone.style.overflow = 'hidden';
    clone.style.whiteSpace = 'nowrap';
    clone.style.textOverflow = 'ellipsis';
    
    // Make sure clone is visible
    clone.style.opacity = '1';
    clone.style.visibility = 'visible';
    
    // Append to wrapper, then to animation layer
    wrapper.appendChild(clone);
    animationLayer.appendChild(wrapper);
    
    console.log('[SharedElement] Elements created', { 
      wrapper,
      clone,
      inDOM: animationLayer.contains(wrapper),
    });
    
    // Force browser to calculate layout before animating
    void clone.offsetHeight;
    
    // Get target styles to transition to
    const targetStyles = window.getComputedStyle(targetNode);
    
    // Additional position check - if target is too far outside viewport, adjust
    let finalLeft = targetRect.left;
    let finalTop = targetRect.top;
    
    if (finalLeft < 0 || finalLeft > window.innerWidth) {
      finalLeft = window.innerWidth / 2 - targetRect.width / 2;
      console.log('[SharedElement] Adjusted horizontal position to viewport center', finalLeft);
    }
    
    if (finalTop < 0 || finalTop > window.innerHeight) {
      finalTop = window.innerHeight / 3; // Top third of screen
      console.log('[SharedElement] Adjusted vertical position to viewport top third', finalTop);
    }
    
    // Animate the clone from source to target position
    gsap.to(clone, {
      left: finalLeft,
      top: finalTop,
      width: targetRect.width,
      height: targetRect.height,
      fontSize: targetStyles.fontSize,
      fontWeight: targetStyles.fontWeight,
      color: targetStyles.color,
      backgroundColor: 'rgba(255,255,255,0)', // Fade out background
      duration: duration / 1000,
      ease: "power3.inOut",
      onUpdate: function() {
        // Log position at animation midpoint
        if (this.progress() === 0.5) {
          const currentRect = clone.getBoundingClientRect();
          console.log('[SharedElement] Animation midpoint position:', {
            left: currentRect.left,
            top: currentRect.top,
            progress: this.progress(),
            targetLeft: finalLeft,
            targetTop: finalTop
          });
          
          // Check if target position has changed and update if needed
          const updatedTargetRect = targetNode.getBoundingClientRect();
          if (Math.abs(updatedTargetRect.left - finalLeft) > 5 || 
              Math.abs(updatedTargetRect.top - finalTop) > 5) {
            console.log('[SharedElement] Target position changed during animation, updating');
            gsap.to(clone, {
              left: updatedTargetRect.left,
              top: updatedTargetRect.top,
              width: updatedTargetRect.width,
              height: updatedTargetRect.height,
              duration: this.progress() * (duration / 1000),
              ease: "power2.out"
            });
          }
        }
      },
      onComplete: () => {
        // Final position check
        const finalRect = clone.getBoundingClientRect();
        const targetFinalRect = targetNode.getBoundingClientRect();
        console.log('[SharedElement] Animation final positions:', {
          clone: {
            left: finalRect.left,
            top: finalRect.top
          },
          target: {
            left: targetFinalRect.left,
            top: targetFinalRect.top
          },
          difference: {
            left: Math.abs(finalRect.left - targetFinalRect.left),
            top: Math.abs(finalRect.top - targetFinalRect.top)
          }
        });
        
        // Show the real target element
        gsap.to(targetNode, { 
          autoAlpha: 1, 
          duration: 0.1 
        });
        
        // Remove the clone after a slight delay to ensure smooth transition
        setTimeout(() => {
          if (wrapper.parentNode === animationLayer) {
            animationLayer.removeChild(wrapper);
            console.log('[SharedElement] Animation complete, elements removed');
          }
          
          // Call the completion callback
          if (options?.onComplete) {
            options.onComplete();
          }
        }, 50);
      }
    });
  } catch (error) {
    console.error('[SharedElement] Animation error:', error);
    // Show the target immediately in case of error
    if (targetNode) {
      gsap.set(targetNode, { autoAlpha: 1 });
    }
    // Call completion callback
    if (options?.onComplete) {
      options.onComplete();
    }
  }
}

/**
 * Test function to create a visible clone at a fixed position on the screen.
 * Used for debugging when animations aren't visible.
 */
export function createTestClone(sourceNode: HTMLElement | null): void {
  // Ensure we're running on client side
  if (typeof window === 'undefined' || typeof document === 'undefined' || !sourceNode) {
    console.log('[TestClone] Not running (SSR or missing node)');
    return;
  }
  
  try {
    // Get animation layer
    const animationLayer = getAnimationLayer();
    if (!animationLayer) {
      console.error('[TestClone] Animation layer not available');
      return;
    }
    
    // Log animation layer state
    console.log('[TestClone] Animation layer detected:', {
      element: animationLayer,
      isBody: animationLayer === document.body,
      position: animationLayer.style.position,
      zIndex: animationLayer.style.zIndex,
      childCount: animationLayer.childNodes.length
    });
    
    // Create a wrapper for the test clone
    const wrapper = document.createElement('div');
    wrapper.className = 'test-clone-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.zIndex = '2147483647'; // Max z-index
    
    // Create test clone with extremely bright styling
    const clone = document.createElement('div');
    const timestamp = new Date().toISOString();
    clone.textContent = `TEST CLONE: ${sourceNode.textContent || 'Unknown'} (${timestamp})`;
    clone.style.position = 'absolute';
    clone.style.top = '100px';
    clone.style.left = '100px';
    clone.style.width = '400px';
    clone.style.height = '80px';
    clone.style.backgroundColor = 'lime'; // Bright green
    clone.style.color = 'black';
    clone.style.padding = '10px';
    clone.style.fontWeight = 'bold';
    clone.style.fontSize = '18px';
    clone.style.border = '5px solid red';
    clone.style.borderRadius = '10px';
    clone.style.boxShadow = '0 0 30px 10px rgba(255,0,0,0.7)';
    clone.style.display = 'flex';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.textAlign = 'center';
    clone.style.transition = 'all 1s ease-in-out';
    
    // Add to wrapper, then to animation layer
    wrapper.appendChild(clone);
    animationLayer.appendChild(wrapper);
    
    console.log('[TestClone] Created test clone', {
      clone,
      wrapper,
      inDOM: document.body.contains(wrapper) || (animationLayer !== document.body && animationLayer.contains(wrapper)),
      animationLayerChildCount: animationLayer.childNodes.length
    });
    
    // Animate the clone to make it more obvious
    setTimeout(() => {
      // Move to right side
      clone.style.left = '400px';
      clone.style.backgroundColor = 'yellow';
      console.log('[TestClone] Moved to position 1');
    }, 1000);
    
    setTimeout(() => {
      // Move to bottom right
      clone.style.left = '400px';
      clone.style.top = '400px';
      clone.style.backgroundColor = 'cyan';
      console.log('[TestClone] Moved to position 2');
    }, 2000);
    
    setTimeout(() => {
      // Move to bottom left
      clone.style.left = '100px';
      clone.style.top = '400px';
      clone.style.backgroundColor = 'magenta';
      console.log('[TestClone] Moved to position 3');
    }, 3000);
    
    setTimeout(() => {
      // Return to start
      clone.style.left = '100px';
      clone.style.top = '100px';
      clone.style.backgroundColor = 'lime';
      console.log('[TestClone] Returned to start position');
    }, 4000);
    
    // Remove after 8 seconds
    setTimeout(() => {
      console.log('[TestClone] Attempting to remove clone');
      if (wrapper.parentNode) {
        try {
          wrapper.parentNode.removeChild(wrapper);
          console.log('[TestClone] Successfully removed test clone');
        } catch (err) {
          console.error('[TestClone] Error removing test clone:', err);
        }
      } else {
        console.warn('[TestClone] Clone wrapper has no parent to remove from');
      }
    }, 8000);
  } catch (error) {
    console.error('[TestClone] Error creating test clone:', error);
  }
}

/**
 * Minimal shared element animation: create and show a clone at the source position.
 * @param sourceNode The DOM node of the event title in the calendar
 */
export function animateModalTitleSharedElementMinimal(
  sourceNode: HTMLElement | null,
  targetNode: HTMLElement | null = null
) {
  // Ensure we're running on client side
  if (typeof window === 'undefined' || typeof document === 'undefined' || !sourceNode) {
    console.log('[MinimalSharedElement] Not running (SSR or missing node)');
    return;
  }

  try {
    // Get source rect
    const sourceRect = sourceNode.getBoundingClientRect();
    
    // Get target position if target node provided
    let targetRect: DOMRect | null = null;
    if (targetNode) {
      targetRect = targetNode.getBoundingClientRect();
      console.log('[MinimalSharedElement] Target position:', targetRect);
    }

    // Create a wrapper element
    const wrapper = document.createElement('div');
    wrapper.className = 'test-animation-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.zIndex = '2147483647'; // Max possible z-index

    // Get the animation layer
    const animationLayer = getAnimationLayer();
    if (!animationLayer) {
      console.error('[MinimalSharedElement] Animation layer not available');
      return;
    }
    
    // Create a content element with very visible styling
    const content = document.createElement('div');
    content.className = 'test-animation-content';
    content.textContent = sourceNode.textContent || 'TEST ANIMATION';
    content.style.position = 'absolute';
    content.style.left = `${sourceRect.left}px`;
    content.style.top = `${sourceRect.top}px`;
    content.style.width = `${Math.max(sourceRect.width, 100)}px`;
    content.style.height = `${Math.max(sourceRect.height, 30)}px`;
    content.style.background = '#ffcc00'; // Bright yellow
    content.style.border = '3px solid #ff3300'; // Bright red border
    content.style.color = '#000000'; // Black text
    content.style.fontWeight = 'bold';
    content.style.padding = '5px';
    content.style.boxSizing = 'border-box';
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.justifyContent = 'center';
    content.style.boxShadow = '0 0 20px 5px rgba(255,204,0,0.7)'; // Glow effect
    content.style.borderRadius = '4px';
    
    // If we have a target, add a path element to show the animation path
    if (targetRect) {
      const path = document.createElement('div');
      path.className = 'animation-path';
      path.style.position = 'absolute';
      path.style.border = '2px dashed red';
      path.style.zIndex = '2147483646';
      path.style.pointerEvents = 'none';
      
      // Calculate path coordinates
      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;
      
      // Create marker at target position
      const targetMarker = document.createElement('div');
      targetMarker.className = 'target-marker';
      targetMarker.style.position = 'absolute';
      targetMarker.style.left = `${targetRect.left}px`;
      targetMarker.style.top = `${targetRect.top}px`;
      targetMarker.style.width = `${targetRect.width}px`;
      targetMarker.style.height = `${targetRect.height}px`;
      targetMarker.style.border = '3px solid blue';
      targetMarker.style.boxShadow = '0 0 10px rgba(0,0,255,0.5)';
      targetMarker.style.borderRadius = '4px';
      targetMarker.style.pointerEvents = 'none';
      targetMarker.style.zIndex = '2147483646';
      
      wrapper.appendChild(targetMarker);
      
      // Draw line connecting source and target
      const line = document.createElement('div');
      line.className = 'connection-line';
      line.style.position = 'absolute';
      line.style.width = '4px';
      line.style.backgroundColor = 'red';
      line.style.zIndex = '2147483645';
      line.style.pointerEvents = 'none';
      
      // Calculate length and angle
      const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
      
      // Position the line
      line.style.left = `${startX}px`;
      line.style.top = `${startY}px`;
      line.style.height = `${length}px`;
      line.style.transformOrigin = '0 0';
      line.style.transform = `rotate(${angle}deg)`;
      
      wrapper.appendChild(line);
    }
    
    wrapper.appendChild(content);
    animationLayer.appendChild(wrapper);
    
    console.log('[MinimalSharedElement] Animation elements created', { 
      wrapper, 
      content, 
      inDOM: animationLayer.contains(wrapper),
      animationLayer
    });

    // Force a reflow
    void content.offsetHeight;
    
    // Target position for animation
    const targetX = targetRect ? 
      targetRect.left : 
      window.innerWidth / 2 - content.offsetWidth / 2;
    
    const targetY = targetRect ? 
      targetRect.top : 
      window.innerHeight / 3;
    
    // Animate the content using GSAP to the target position
    gsap.to(content, {
      left: targetX,
      top: targetY,
      width: targetRect ? targetRect.width : content.offsetWidth * 1.5,
      height: targetRect ? targetRect.height : content.offsetHeight,
      scale: 1,
      rotation: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Add "complete" text to indicate animation finished
        content.textContent = `${content.textContent} - ANIMATION COMPLETE`;
        content.style.background = '#00cc66'; // Change to green to indicate completion
        
        // Remove after delay
        setTimeout(() => {
          if (wrapper.parentNode === animationLayer) {
            animationLayer.removeChild(wrapper);
            console.log('[MinimalSharedElement] Animation elements removed');
          }
        }, 2000); // Longer wait to ensure visibility
      }
    });
  } catch (error) {
    console.error('[MinimalSharedElement] Animation error:', error);
  }
} 