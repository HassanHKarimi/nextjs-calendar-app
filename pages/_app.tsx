// Fallback _app.tsx for Pages Router
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '../src/app/globals.css'
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className={inter.className}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </ThemeProvider>
    </SessionProvider>
  )
}