// pages/_app.tsx
import { AppProps } from 'next/app';
import Navbar from '../components/NavBar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar /> {/* This will be displayed on every page */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;