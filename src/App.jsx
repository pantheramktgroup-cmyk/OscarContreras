import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ThankYouPage from './pages/ThankYouPage.jsx';
import VideoExplicativoPage from './pages/VideoExplicativoPage.jsx';
import ScrollToTop from './components/ui/ScrollToTop.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/thank-you-page" element={<ThankYouPage />} />
        <Route path="/video-explicativo-page" element={<VideoExplicativoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
