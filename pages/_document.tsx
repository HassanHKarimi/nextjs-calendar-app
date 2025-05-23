import { Html, Head, Main, NextScript } from 'next/document'

// Server-side log
console.log("[DIAGNOSTIC] _document.tsx module loaded (server-side)");

export default function Document() {
  console.log("[DIAGNOSTIC] Document component rendering (server-side)");
  
  return (
    <Html lang="en">
      <Head>
        {/* Add inline script to log page load and create animation layers */}
        <script dangerouslySetInnerHTML={{
          __html: `
            console.log("[DIAGNOSTIC] Document loaded in browser at: " + new Date().toISOString());
            console.log("[DIAGNOSTIC] Current URL: " + window.location.href);
            
            // Create animation layer as soon as possible
            document.addEventListener('DOMContentLoaded', function() {
              // Create animation layer if it doesn't exist
              if (!document.getElementById('animation-layer')) {
                const animLayer = document.createElement('div');
                animLayer.id = 'animation-layer';
                animLayer.style.position = 'fixed';
                animLayer.style.top = '0';
                animLayer.style.left = '0';
                animLayer.style.width = '100%';
                animLayer.style.height = '100%';
                animLayer.style.pointerEvents = 'none';
                animLayer.style.zIndex = '9999';
                animLayer.style.overflow = 'hidden';
                document.body.appendChild(animLayer);
                console.log("[ANIMATION] Created animation layer");
              }
              
              // Create modal root if it doesn't exist
              if (!document.getElementById('modal-root')) {
                const modalRoot = document.createElement('div');
                modalRoot.id = 'modal-root';
                document.body.appendChild(modalRoot);
                console.log("[ANIMATION] Created modal root");
              }
            });
          `
        }} />
      </Head>
      <body>
        <Main />
        <div id="animation-layer"></div>
        <div id="modal-root"></div>
        <NextScript />
      </body>
    </Html>
  )
}