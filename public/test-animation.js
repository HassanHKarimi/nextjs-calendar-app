/**
 * Test Animation Script
 * 
 * This script creates test elements to verify if animations and DOM insertions
 * are working properly in the browser environment.
 * 
 * To use: Add <script src="/test-animation.js"></script> to your HTML or
 * paste this code into the browser console.
 */

(function() {
  // Wait for DOM to be ready
  function domReady(callback) {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }
  
  // Create a test button that triggers animations
  function createTestControls() {
    const controls = document.createElement('div');
    controls.style.position = 'fixed';
    controls.style.top = '10px';
    controls.style.right = '10px';
    controls.style.zIndex = '2147483646';
    controls.style.backgroundColor = 'white';
    controls.style.padding = '10px';
    controls.style.border = '1px solid #333';
    controls.style.borderRadius = '4px';
    controls.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    const header = document.createElement('h3');
    header.textContent = 'Animation Test Controls';
    header.style.margin = '0 0 10px 0';
    header.style.fontSize = '14px';
    controls.appendChild(header);
    
    const buttonStyles = `
      display: block;
      margin: 5px 0;
      padding: 5px 10px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    
    const createButton = (text, onClick) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.setAttribute('style', buttonStyles);
      button.addEventListener('click', onClick);
      controls.appendChild(button);
      return button;
    };
    
    createButton('Create Fixed Red Div', createFixedDiv);
    createButton('Create Animated Element', createAnimatedElement);
    createButton('Create Animation Layer Div', createAnimationLayerDiv);
    createButton('Create Body Element', createBodyElement);
    
    document.body.appendChild(controls);
    console.log('Test controls created and appended to document.body');
  }
  
  // Create a fixed red div in the top-left corner
  function createFixedDiv() {
    const div = document.createElement('div');
    div.textContent = 'TEST DIV (fixed position)';
    div.style.position = 'fixed';
    div.style.top = '50px';
    div.style.left = '50px';
    div.style.width = '200px';
    div.style.height = '50px';
    div.style.backgroundColor = 'red';
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.zIndex = '2147483647';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '14px';
    div.style.border = '2px solid black';
    div.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    
    document.body.appendChild(div);
    console.log('Fixed red div created', div);
    
    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
        console.log('Fixed red div removed after timeout');
      }
    }, 5000);
  }
  
  // Create an animated element that moves across the screen
  function createAnimatedElement() {
    const div = document.createElement('div');
    div.textContent = 'ANIMATED ELEMENT';
    div.style.position = 'fixed';
    div.style.top = '100px';
    div.style.left = '50px';
    div.style.width = '150px';
    div.style.height = '40px';
    div.style.backgroundColor = 'green';
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.zIndex = '2147483647';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '14px';
    div.style.borderRadius = '20px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.transition = 'transform 1s ease-in-out, background-color 1s';
    
    document.body.appendChild(div);
    console.log('Animated element created', div);
    
    // Force reflow
    div.offsetHeight;
    
    // Start animation
    setTimeout(() => {
      div.style.transform = 'translateX(300px)';
      div.style.backgroundColor = 'blue';
    }, 100);
    
    // Remove after animation
    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
        console.log('Animated element removed after animation');
      }
    }, 5000);
  }
  
  // Create a div inside the animation layer
  function createAnimationLayerDiv() {
    const animLayer = document.getElementById('animation-layer');
    if (!animLayer) {
      console.error('Animation layer not found!');
      return;
    }
    
    const div = document.createElement('div');
    div.textContent = 'ANIMATION LAYER DIV';
    div.style.position = 'absolute';
    div.style.top = '150px';
    div.style.left = '50px';
    div.style.width = '200px';
    div.style.height = '50px';
    div.style.backgroundColor = 'purple';
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '14px';
    div.style.border = '2px dashed white';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    
    animLayer.appendChild(div);
    console.log('Animation layer div created', div, 'appended to', animLayer);
    
    setTimeout(() => {
      if (animLayer.contains(div)) {
        animLayer.removeChild(div);
        console.log('Animation layer div removed after timeout');
      }
    }, 5000);
  }
  
  // Create a regular element in document.body
  function createBodyElement() {
    const div = document.createElement('div');
    div.textContent = 'BODY ELEMENT (absolute)';
    div.style.position = 'absolute';
    div.style.top = '200px';
    div.style.left = '50px';
    div.style.width = '220px';
    div.style.height = '50px';
    div.style.backgroundColor = 'orange';
    div.style.color = 'black';
    div.style.padding = '10px';
    div.style.zIndex = '1000';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '14px';
    div.style.border = '2px solid black';
    div.style.textAlign = 'center';
    div.style.lineHeight = '30px';
    
    document.body.appendChild(div);
    console.log('Body element created', div);
    
    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
        console.log('Body element removed after timeout');
      }
    }, 5000);
  }
  
  // Initialize
  domReady(() => {
    console.log('Test animation script initialized');
    createTestControls();
  });
})(); 