import React, { useEffect, useState } from 'react';
import { createVisibleClone, createTestIframe } from './animation/SimpleClone';
import { createTestClone } from './animation/modalTitleSharedElement';

/**
 * DevTools component
 * Includes development tools that are only loaded in development mode
 */
const DevTools: React.FC = () => {
  const [isDev, setIsDev] = useState(false);
  const [showAnimationTools, setShowAnimationTools] = useState(false);
  
  useEffect(() => {
    // Check if we're in development mode
    setIsDev(process.env.NODE_ENV === 'development');
    
    if (process.env.NODE_ENV === 'development') {
      // Load the test animation script
      const script = document.createElement('script');
      script.src = '/test-animation.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        // Clean up script on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  const testAnimation = () => {
    // Find a random event title in the DOM as the source
    const eventTitles = document.querySelectorAll('.calendar-event');
    if (eventTitles.length > 0) {
      const randomIndex = Math.floor(Math.random() * eventTitles.length);
      createTestClone(eventTitles[randomIndex] as HTMLElement);
    } else {
      // Fallback to a simple test if no event titles found
      const testElement = document.createElement('div');
      testElement.textContent = "Test Element";
      testElement.style.position = 'fixed';
      testElement.style.left = '50px';
      testElement.style.top = '50px';
      testElement.style.visibility = 'hidden';
      document.body.appendChild(testElement);
      createTestClone(testElement);
      setTimeout(() => document.body.removeChild(testElement), 100);
    }
  };
  
  const testVisibleClone = () => {
    // Create a simple visible clone to test DOM insertion
    const testElement = document.createElement('div');
    testElement.textContent = "Test Element";
    document.body.appendChild(testElement);
    createVisibleClone(testElement);
    setTimeout(() => document.body.removeChild(testElement), 100);
  };
  
  const testIframe = () => {
    // Create test iframe to check if iframe content appears
    createTestIframe();
  };

  if (!isDev) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          padding: '5px 10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          fontSize: '12px',
          borderRadius: '4px',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={() => setShowAnimationTools(!showAnimationTools)}
      >
        DEV TOOLS
      </div>
      
      {showAnimationTools && (
        <div
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '10px',
            padding: '10px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 1000
          }}
        >
          <button 
            style={{
              background: '#4a90e2',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={testAnimation}
          >
            Test Animation
          </button>
          
          <button 
            style={{
              background: '#e24a4a',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={testVisibleClone}
          >
            Test Visible Clone
          </button>
          
          <button 
            style={{
              background: '#4ae24a',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={testIframe}
          >
            Test iframe
          </button>
        </div>
      )}
    </>
  );
};

export default DevTools; 