// ARCHIVE: Full diagnostic version of shared element animation for modal title.
// This file preserves all previous diagnostic and logging logic for reference.

import gsap from 'gsap';

/**
 * Animate a shared element transition for the modal title.
 * @param sourceNode The DOM node of the event title in the calendar
 * @param targetNode The DOM node of the modal title
 * @param options Optional: duration, onComplete callback
 */
export function animateModalTitleSharedElement(
  sourceNode: HTMLElement,
  targetNode: HTMLElement,
  options?: {
    duration?: number;
    onComplete?: () => void;
  }
) {
  if (!sourceNode || !targetNode) return;

  const sourceRect = sourceNode.getBoundingClientRect();
  const targetRect = targetNode.getBoundingClientRect();

  // Global animation attempt counter
  if (!(window as any)._sharedElementAnimCounter) {
    (window as any)._sharedElementAnimCounter = 1;
  }
  const animId = (window as any)._sharedElementAnimCounter++;
  const now = () => new Date().toISOString();

  console.log(`[Anim${animId}] [${now()}] Event click handler called`);

  // Log source node diagnostics before cloning
  const sourceParent = sourceNode.parentNode;
  const sourceRectBefore = sourceNode.getBoundingClientRect();
  console.log(`[Anim${animId}] [${now()}] Source node diagnostics before cloning`, {
    sourceNode,
    sourceParent,
    isConnected: sourceNode.isConnected,
    sourceRectBefore
  });

  // Create a clone of the source node
  const clone = sourceNode.cloneNode(true) as HTMLElement;
  console.log(`[Anim${animId}] [${now()}] Creating clone from source node`, { sourceNode, sourceRect });
  clone.style.position = 'fixed';
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.zIndex = '2147483647'; // Max z-index
  clone.style.pointerEvents = 'none';
  clone.style.margin = '0';
  clone.style.transition = 'none';
  clone.style.background = 'yellow';
  clone.style.border = '2px solid red';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  clone.style.padding = '0';
  clone.style.opacity = '1';

  // Copy computed text styles from target to clone for morphing
  const computedTarget = window.getComputedStyle(targetNode);
  clone.style.font = computedTarget.font;
  clone.style.fontSize = computedTarget.fontSize;
  clone.style.fontWeight = computedTarget.fontWeight;
  clone.style.letterSpacing = computedTarget.letterSpacing;
  clone.style.lineHeight = computedTarget.lineHeight;
  clone.style.color = computedTarget.color;
  clone.style.textAlign = computedTarget.textAlign;
  clone.style.textTransform = computedTarget.textTransform;
  clone.style.textShadow = computedTarget.textShadow;
  clone.style.fontStyle = computedTarget.fontStyle;
  clone.style.fontFamily = computedTarget.fontFamily;
  clone.style.fontVariant = computedTarget.fontVariant;
  clone.style.fontStretch = computedTarget.fontStretch;
  clone.style.fontKerning = computedTarget.fontKerning;
  clone.style.fontFeatureSettings = computedTarget.fontFeatureSettings;
  clone.style.fontVariationSettings = computedTarget.fontVariationSettings;

  clone.id = 'diagnosis-clone';
  const animationLayer = document.getElementById('animation-layer');
  if (animationLayer) {
    animationLayer.appendChild(clone);
    // Force diagnostic styles
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    clone.style.transform = 'none';
    const computedAfter = window.getComputedStyle(clone);
    const rectAfter = clone.getBoundingClientRect();
    console.log(`[Anim${animId}] [${now()}] Clone diagnostic style forced`, { computedAfter, rectAfter });
    console.log(`[Anim${animId}] [${now()}] Clone appended to #animation-layer`, { clone, rect: clone.getBoundingClientRect(), style: clone.style });
    // Log outerHTML
    console.log(`[Anim${animId}] [${now()}] Clone outerHTML after append`, { clone: clone.outerHTML, parent: animationLayer.outerHTML });
    // MutationObserver to detect removal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node === clone) {
            console.log(`[Anim${animId}] [${now()}] MutationObserver: Clone was removed from #animation-layer`, { clone });
          }
        });
      });
    });
    observer.observe(animationLayer, { childList: true });
    // Log parent and siblings
    console.log(`[Anim${animId}] [${now()}] Clone parent and siblings after append`, { parent: animationLayer, siblings: Array.from(animationLayer.childNodes) });
  } else {
    document.body.appendChild(clone);
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    clone.style.transform = 'none';
    clone.style.top = '0px';
    clone.style.left = '0px';
    const computedAfter = window.getComputedStyle(clone);
    const rectAfter = clone.getBoundingClientRect();
    console.log(`[Anim${animId}] [${now()}] Clone diagnostic style forced (body, top 0 left 0)`, { computedAfter, rectAfter });
    // Log parent and siblings
    console.log(`[Anim${animId}] [${now()}] Clone parent and siblings after append`, { parent: document.body, siblings: Array.from(document.body.childNodes) });
    // Log outerHTML
    console.log(`[Anim${animId}] [${now()}] Clone outerHTML after append`, { clone: clone.outerHTML, parent: document.body.outerHTML });
    // MutationObserver to detect removal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node === clone) {
            console.log(`[Anim${animId}] [${now()}] MutationObserver: Clone was removed from document.body`, { clone });
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
  }
  (window as any).diagnosisClone = clone;
  // After appending the clone, create a test span for absolute visibility
  const testSpan = document.createElement('span');
  testSpan.textContent = 'TEST-SPAN';
  testSpan.style.position = 'fixed';
  testSpan.style.top = '0px';
  testSpan.style.left = '0px';
  testSpan.style.zIndex = '2147483647';
  testSpan.style.background = 'lime';
  testSpan.style.color = 'black';
  testSpan.style.fontSize = '24px';
  testSpan.style.padding = '8px';
  document.body.appendChild(testSpan);
  const testSpanComputed = window.getComputedStyle(testSpan);
  const testSpanRect = testSpan.getBoundingClientRect();
  console.log(`[Anim${animId}] [${now()}] Test span appended to body (fixed)`, { testSpan, testSpanComputed, testSpanRect });

  // Test span with position: absolute
  const absSpan = document.createElement('span');
  absSpan.textContent = 'ABS-SPAN';
  absSpan.style.position = 'absolute';
  absSpan.style.top = '0px';
  absSpan.style.left = '0px';
  absSpan.style.zIndex = '2147483647';
  absSpan.style.background = 'orange';
  absSpan.style.color = 'black';
  absSpan.style.fontSize = '24px';
  absSpan.style.padding = '8px';
  document.body.appendChild(absSpan);
  const absSpanComputed = window.getComputedStyle(absSpan);
  const absSpanRect = absSpan.getBoundingClientRect();
  console.log(`[Anim${animId}] [${now()}] Test span appended to body (absolute)`, { absSpan, absSpanComputed, absSpanRect });

  // Test span inside a visible container
  const container = document.querySelector('.calendar-container, .calendar-main');
  if (container) {
    const contSpan = document.createElement('span');
    contSpan.textContent = 'CONT-SPAN';
    contSpan.style.position = 'absolute';
    contSpan.style.top = '0px';
    contSpan.style.left = '0px';
    contSpan.style.zIndex = '2147483647';
    contSpan.style.background = 'cyan';
    contSpan.style.color = 'black';
    contSpan.style.fontSize = '24px';
    contSpan.style.padding = '8px';
    container.appendChild(contSpan);
    const contSpanComputed = window.getComputedStyle(contSpan);
    const contSpanRect = contSpan.getBoundingClientRect();
    console.log(`[Anim${animId}] [${now()}] Test span appended to container`, { contSpan, contSpanComputed, contSpanRect });
  } else {
    console.log(`[Anim${animId}] [${now()}] No visible container found for test span`);
  }

  setTimeout(() => {
    const computed = window.getComputedStyle(clone);
    const rect = clone.getBoundingClientRect();
    console.log('[Diagnosis] Clone after append', { computed, rect });
  }, 0);

  // Animate the clone to the target position and style
  gsap.to(clone, {
    x: targetRect.left - sourceRect.left,
    y: targetRect.top - sourceRect.top,
    width: targetRect.width,
    height: targetRect.height,
    fontSize: computedTarget.fontSize,
    color: computedTarget.color,
    fontWeight: computedTarget.fontWeight,
    duration: options?.duration ?? 0.4,
    ease: 'power2.inOut',
    opacity: 0.15,
    onComplete: () => {
      console.log(`[Anim${animId}] [${now()}] Animation complete, clone will be removed in 10s`, { clone });
      setTimeout(() => {
        document.body.removeChild(clone);
        if (options?.onComplete) options.onComplete();
      }, 10000); // 10 seconds for debug
    },
  });

  console.log(`[Anim${animId}] [${now()}] Clone removed`);
} 