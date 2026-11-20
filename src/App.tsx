import React, { useState, useCallback, useRef } from 'react';
import { TouchCanvas } from './components/TouchCanvas';
import { SplashScreen } from './components/SplashScreen';
import { Watermarks } from './components/Watermarks';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CardGrid } from './components/CardGrid';
import { Tagline } from './components/Tagline';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    setIsToastVisible(true);
    toastTimeoutRef.current = window.setTimeout(() => {
      setIsToastVisible(false);
      toastTimeoutRef.current = null;
    }, 2400);
  }, []);

  return (
    <>
      <TouchCanvas />
      <SplashScreen />

      <div className="app-wrapper">
        <Watermarks />

        <main className="content-container">
          <Header />
          <Hero />
          <CardGrid />
          <Tagline />
        </main>

        <Footer onAddressClick={() => showToast('Opening Ahmedabad HQ in Maps...')} />
      </div>

      <Toast message={toastMessage} visible={isToastVisible} />
    </>
  );
};

export default App;
