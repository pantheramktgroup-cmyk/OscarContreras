import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useLiteMotion } from '../../hooks/useLiteMotion.js';
import './LogoMarquee.css';

// Marquee horizontal infinito y suave. Pausa al hover/focus.
// Reduced motion: scroll manual (overflow) sin autoplay.
// Celulares: se mueve solo mientras está en pantalla (ver useLiteMotion).
export default function LogoMarquee({ logos }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const lite = useLiteMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const track = trackRef.current;
      if (!track) return;

      // El track contiene los logos duplicados una vez → animamos -50%.
      const tween = gsap.to(track, {
        xPercent: -50,
        ease: 'none',
        duration: Math.max(24, logos.length * 2.4),
        repeat: -1,
      });

      const root = ref.current;

      if (lite) {
        // En celular no hay hover: el carrusel corre solo cuando se ve y se
        // pausa al salir de pantalla, para no gastar mientras se baja.
        tween.pause();
        const visibility = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        });
        if (visibility.isActive) tween.play();
        return undefined;
      }

      const pause = () => tween.pause();
      const play = () => tween.play();
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', play);
      root.addEventListener('focusin', pause);
      root.addEventListener('focusout', play);

      return () => {
        root.removeEventListener('pointerenter', pause);
        root.removeEventListener('pointerleave', play);
        root.removeEventListener('focusin', pause);
        root.removeEventListener('focusout', play);
      };
    },
    { scope: ref, dependencies: [reduced, lite] }
  );

  const items = reduced ? logos : [...logos, ...logos];

  return (
    <div
      className={`marquee ${reduced ? 'marquee--static' : ''}`}
      ref={ref}
    >
      <ul className="marquee__track" ref={trackRef}>
        {items.map((logo, i) => (
          <li className="marquee__item" key={`${logo.name}-${i}`}>
            <img
              src={logo.src}
              alt={`Logo cliente ${logo.name}`}
              width="160"
              height="66"
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
