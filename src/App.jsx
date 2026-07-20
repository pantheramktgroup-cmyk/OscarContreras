import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ThankYouPage from './pages/ThankYouPage.jsx';
import VideoExplicativoPage from './pages/VideoExplicativoPage.jsx';
import ScrollToTop from './components/ui/ScrollToTop.jsx';

const LANDING_VARIANT_KEY = 'landingVariant';

function getVariantFromSearch(search) {
  const value = new URLSearchParams(search).get('variant');
  if (!value) return null;
  const normalized = value.toUpperCase();
  return normalized === 'A' || normalized === 'B' ? normalized : null;
}

function getStoredVariant() {
  const stored = localStorage.getItem(LANDING_VARIANT_KEY);
  return stored === 'A' || stored === 'B' ? stored : null;
}

function resolveLandingVariant(search) {
  const queryVariant = getVariantFromSearch(search);
  if (queryVariant) {
    localStorage.setItem(LANDING_VARIANT_KEY, queryVariant);
    return queryVariant;
  }

  const storedVariant = getStoredVariant();
  if (storedVariant) {
    return storedVariant;
  }

  const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem(LANDING_VARIANT_KEY, randomVariant);
  return randomVariant;
}

function ImpulsoLaboralRoute() {
  const { search } = useLocation();
  const [landingVariant, setLandingVariant] = useState(() => resolveLandingVariant(window.location.search));

  useEffect(() => {
    setLandingVariant(resolveLandingVariant(search));
  }, [search]);

  return <LandingPage landingVariant={landingVariant} />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/impulso-laboral" replace />} />
        <Route path="/impulso-laboral" element={<ImpulsoLaboralRoute />} />
        <Route path="/proximos-pasos" element={<ThankYouPage />} />
        <Route path="/importante" element={<VideoExplicativoPage />} />

        <Route path="/thank-you-page" element={<Navigate to="/proximos-pasos" replace />} />
        <Route path="/video-explicativo-page" element={<Navigate to="/importante" replace />} />

        <Route path="*" element={<Navigate to="/impulso-laboral" replace />} />
      </Routes>
    </>
  );
}
