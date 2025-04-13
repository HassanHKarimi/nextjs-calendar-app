// Minimal _app.tsx without any CSS frameworks
import type { AppProps } from 'next/app'
import '../src/app/styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
