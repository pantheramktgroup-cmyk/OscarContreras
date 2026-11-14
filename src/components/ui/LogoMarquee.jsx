import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useLiteMotion } from '../../hooks/useLiteMotion.js';
import './LogoMarquee.css';

// Marquee horizontal infinito y suave. Pausa al hover/focus.
// Reduced motion: scroll manual (overflow) sin autoplay.
// Celulares (modo liviano): el movimiento lo hace una animación CSS, que no
// ocupa el hilo de JS, y se pausa cuando el carrusel sale de pantalla.
export default function LogoMarquee({ logos }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const lite = useLiteMotion();
  const cssLoop = lite && !reduced;
  const duration = Math.max(24, logos.length * 2.4);

  useGSAP(
    () => {
      if (reduced || lite) return;
      const track = trackRef.current;
      if (!track) return;

      // El track contiene los logos duplicados una vez → animamos -50%.
      const tween = gsap.to(track, {
        xPercent: -50,
        ease: 'none',
        duration,
        repeat: -1,
      });

      const root = ref.current;
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

  useEffect(() => {
    if (!cssLoop) return undefined;
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle('is-paused', !entry.isIntersecting);
      },
      { rootMargin: '120px 0px' }
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      root.classList.remove('is-paused');
    };
  }, [cssLoop]);

  const items = reduced ? logos : [...logos, ...logos];
  const classes = [
    'marquee',
    reduced ? 'marquee--static' : '',
    cssLoop ? 'marquee--css' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={ref}>
      <ul
        className="marquee__track"
        ref={trackRef}
        style={cssLoop ? { '--marquee-duration': `${duration}s` } : undefined}
      >
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
