import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap.js';
import CareerTrajectoryBackground from '../components/layout/CareerTrajectoryBackground.jsx';
import HeroSection from '../components/sections/HeroSection.jsx';
import ClientLogosSection from '../components/sections/ClientLogosSection.jsx';
import EvaluationSection from '../components/sections/EvaluationSection.jsx';
import PainPointsSection from '../components/sections/PainPointsSection.jsx';
import ProposalSection from '../components/sections/ProposalSection.jsx';
import DifferentiatorsSection from '../components/sections/DifferentiatorsSection.jsx';
import ImpactSection from '../components/sections/ImpactSection.jsx';
import TestimonialsSection from '../components/sections/TestimonialsSection.jsx';
import EmpoderaSection from '../components/sections/EmpoderaSection.jsx';
import BookingSection from '../components/sections/BookingSection.jsx';
import OscarSection from '../components/sections/OscarSection.jsx';
import MediaSection from '../components/sections/MediaSection.jsx';
import Footer from '../components/layout/Footer.jsx';
import '../styles/sections.css';

// Contenido idéntico a la landing original. No se altera.
export default function LandingPage({ landingVariant = 'A' }) {
  const appRef = useRef(null);
  const isVariantB = landingVariant === 'B';

  useGSAP(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => window.removeEventListener('load', onLoad);
  });

  return (
    <>
      <CareerTrajectoryBackground />
      <main className="app" ref={appRef}>
        <HeroSection />
        <ClientLogosSection />
        {isVariantB ? (
          <>
            <BookingSection landingVariant={landingVariant} />
            <TestimonialsSection />
            <OscarSection />
            <MediaSection />
          </>
        ) : (
          <>
            <EvaluationSection />
            <PainPointsSection />
            <ProposalSection />
            <DifferentiatorsSection />
            <ImpactSection />
            <TestimonialsSection />
            <EmpoderaSection />
            <BookingSection landingVariant={landingVariant} />
            <OscarSection />
            <MediaSection />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
