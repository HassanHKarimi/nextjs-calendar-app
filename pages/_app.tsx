// Fallback _app.tsx for Pages Router
import type { AppProps } from 'next/app'
import '../src/app/globals.css'
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  // Simplified app wrapper without AuthProvider
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className={inter.className}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </ThemeProvider>
  );
}