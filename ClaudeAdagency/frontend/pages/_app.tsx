import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999, 
        background: '#e36414', 
        color: 'white', 
        textAlign: 'center', 
        padding: '8px', 
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        🚀 SYSTEM UPDATE (v1.0.2): LIP SYNC & AUDIO CONTROLS NOW LIVE
      </div>
      <div style={{ paddingTop: '40px' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
