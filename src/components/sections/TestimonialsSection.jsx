import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import SectionShell from '../layout/SectionShell.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import TestimonialCard from '../ui/TestimonialCard.jsx';
import PrimaryCTA from '../ui/PrimaryCTA.jsx';
import { testimonials, testimonialsSection } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

// Carrusel premium con scroll-snap, drag en desktop, swipe en mobile,
// autoplay suave con pausa en hover/focus. Reduced motion: sin autoplay.
// Props opcionales: title (sobreescribe el título) y showCta (muestra CTA).
export default function TestimonialsSection({ title, showCta = true }) {
  const headingTitle = title ?? testimonialsSection.title;
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    (context, contextSafe) => {
      const track = trackRef.current;
      if (!track) return;

      // Drag-to-scroll con puntero (desktop). El scroll táctil es nativo.
      let isDown = false;
      let startX = 0;
      let startScroll = 0;

      const onDown = contextSafe((e) => {
        if (e.pointerType === 'touch') return;
        isDown = true;
        startX = e.clientX;
        startScroll = track.scrollLeft;
        track.classList.add('is-dragging');
      });
      const onMove = contextSafe((e) => {
        if (!isDown) return;
        track.scrollLeft = startScroll - (e.clientX - startX);
      });
      const onUp = contextSafe(() => {
        isDown = false;
        track.classList.remove('is-dragging');
      });

      track.addEventListener('pointerdown', onDown);
      track.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);

      // Autoplay suave (no en reduced motion).
      let autoplay;
      if (!reduced) {
        const step = () => {
          const card = track.querySelector('.tcard');
          if (!card) return;
          const gap = parseFloat(getComputedStyle(track).columnGap || 0);
          const delta = card.offsetWidth + gap;
          const atEnd =
            track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
          gsap.to(track, {
            scrollTo: { x: atEnd ? 0 : track.scrollLeft + delta },
            duration: 0.9,
            ease: 'power2.inOut',
          });
        };
        autoplay = gsap.delayedCall(4.5, function loop() {
          step();
          autoplay = gsap.delayedCall(4.5, loop);
        });

        const pause = () => autoplay && autoplay.pause();
        const resume = () => autoplay && autoplay.play();
        const root = ref.current;
        root.addEventListener('pointerenter', pause);
        root.addEventListener('pointerleave', resume);
        root.addEventListener('focusin', pause);
        root.addEventListener('focusout', resume);

        return () => {
          track.removeEventListener('pointerdown', onDown);
          track.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          autoplay && autoplay.kill();
          root.removeEventListener('pointerenter', pause);
          root.removeEventListener('pointerleave', resume);
          root.removeEventListener('focusin', pause);
          root.removeEventListener('focusout', resume);
        };
      }

      return () => {
        track.removeEventListener('pointerdown', onDown);
        track.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
    },
    { scope: ref, dependencies: [reduced] }
  );

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    const card = track?.querySelector('.tcard');
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || 0);
    const delta = (card.offsetWidth + gap) * dir;
    if (reduced) {
      track.scrollBy({ left: delta });
    } else {
      gsap.to(track, {
        scrollTo: { x: track.scrollLeft + delta },
        duration: 0.7,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <SectionShell variant="light" className="testi">
      <div ref={ref} className="testi__wrap">
        <div className="testi__head">
          <SectionHeading>{headingTitle}</SectionHeading>
          <div className="testi__nav">
            <button
              type="button"
              className="testi__btn"
              aria-label="Testimonio anterior"
              onClick={() => scrollByCard(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="testi__btn"
              aria-label="Testimonio siguiente"
              onClick={() => scrollByCard(1)}
            >
              ›
            </button>
          </div>
        </div>
        <ul
          className="testi__track"
          ref={trackRef}
          tabIndex={0}
          aria-label="Carrusel de testimonios de clientes"
        >
          {testimonials.map((t) => (
            <li className="testi__slide" key={t.name}>
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>
        {showCta && <PrimaryCTA className="testi__cta" />}
      </div>
    </SectionShell>
  );
}
