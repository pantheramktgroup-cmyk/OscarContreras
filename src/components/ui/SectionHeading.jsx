import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import './SectionHeading.css';

// Título de sección con reveal por máscara. El texto permanece visible si JS falla.
export default function SectionHeading({
  eyebrow,
  children,
  as = 'h2',
  align = 'left',
  invert = false,
  className = '',
}) {
  const Tag = as;
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const line = el.querySelector('.heading__line');
      const eye = el.querySelector('.heading__eyebrow');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        defaults: { ease: 'power3.out' },
      });
      if (eye) {
        tl.fromTo(eye, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5 });
      }
      tl.fromTo(
        line,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9 },
        eye ? '-=0.25' : 0
      );
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <div
      ref={ref}
      className={`heading heading--${align} ${invert ? 'heading--invert' : ''} ${className}`}
    >
      {eyebrow && <span className="heading__eyebrow">{eyebrow}</span>}
      <Tag className="heading__title">
        <span className="heading__mask">
          <span className="heading__line">{children}</span>
        </span>
      </Tag>
    </div>
  );
}
