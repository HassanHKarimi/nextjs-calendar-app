/**
 * Ultra simple clone test - just puts a red clone in the top left corner.
 * No animation, just DOM insertion to test if clone visibility works at all.
 */
export function createVisibleClone(sourceNode: HTMLElement): void {
  if (!sourceNode) return;
  
  // Create a clone with minimal styling
  const clone = document.createElement('div');
  clone.textContent = 'THIS IS A TEST CLONE';
  clone.id = 'test-clone';
  
  // Apply very visible styles
  clone.style.position = 'fixed';
  clone.style.top = '10px';
  clone.style.left = '10px';
  clone.style.width = '300px';
  clone.style.height = '50px';
  clone.style.backgroundColor = 'red';
  clone.style.color = 'white';
  clone.style.fontWeight = 'bold';
  clone.style.fontSize = '16px';
  clone.style.padding = '10px';
  clone.style.zIndex = '2147483647'; // Max z-index
  clone.style.opacity = '1';
  clone.style.pointerEvents = 'none';
  clone.style.border = '3px solid black';
  clone.style.boxShadow = '0 0 20px 5px rgba(0,0,0,0.5)';
  
  // Log before and after append
  console.log('About to append test clone', clone);
  document.body.appendChild(clone);
  console.log('Test clone appended to document.body', clone);
  
  // Remove after 10 seconds
  setTimeout(() => {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
      console.log('Test clone removed after 10s');
    }
  }, 10000);
}

/**
 * Test function that creates an iframe with simple HTML content.
 * This helps diagnose if there are issues specific to DOM nodes or if iframe content also doesn't appear.
 */
export function createTestIframe(): void {
  // Create an iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'test-iframe';
  
  // Style the iframe
  iframe.style.position = 'fixed';
  iframe.style.top = '70px';  // Below the test clone
  iframe.style.left = '10px';
  iframe.style.width = '300px';
  iframe.style.height = '100px';
  iframe.style.border = '3px solid blue';
  iframe.style.zIndex = '2147483646';  // Just below the test clone
  
  // Log before append
  console.log('About to append test iframe');
  document.body.appendChild(iframe);
  
  // Set iframe content after it's appended to the DOM
  setTimeout(() => {
    if (iframe.contentDocument) {
      iframe.contentDocument.body.style.margin = '0';
      iframe.contentDocument.body.style.padding = '10px';
      iframe.contentDocument.body.style.backgroundColor = 'blue';
      iframe.contentDocument.body.style.color = 'white';
      iframe.contentDocument.body.style.fontFamily = 'sans-serif';
      iframe.contentDocument.body.style.fontSize = '16px';
      iframe.contentDocument.body.style.fontWeight = 'bold';
      
      iframe.contentDocument.body.innerHTML = '<div>THIS IS AN IFRAME TEST</div>';
      console.log('Iframe content set');
    }
  }, 100);
  
  // Log after append
  console.log('Test iframe appended to document.body', iframe);
  
  // Remove after 10 seconds
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
      console.log('Test iframe removed after 10s');
    }
  }, 10000);
} 