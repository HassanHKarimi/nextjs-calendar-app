import { Html, Head, Main, NextScript } from 'next/document'

// Server-side log
console.log("[DIAGNOSTIC] _document.tsx module loaded (server-side)");

export default function Document() {
  console.log("[DIAGNOSTIC] Document component rendering (server-side)");
  
  return (
    <Html lang="en">
      <Head>
        {/* Add inline script to log page load */}
        <script dangerouslySetInnerHTML={{
          __html: `
            console.log("[DIAGNOSTIC] Document loaded in browser at: " + new Date().toISOString());
            console.log("[DIAGNOSTIC] Current URL: " + window.location.href);
            console.log("[DIAGNOSTIC] User Agent: " + navigator.userAgent);
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}