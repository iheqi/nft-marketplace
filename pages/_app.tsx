import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { Web3Provider } from '../components/providers'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>
  )
}
