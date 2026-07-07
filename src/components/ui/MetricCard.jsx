import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

// Anima (count-up) el PRIMER entero del texto, preservando el copy exacto.
// El valor final coincide siempre con la cifra original.
export default function MetricCard({ text }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const match = text.match(/\d+/);
  const hasNumber = Boolean(match);
  const before = hasNumber ? text.slice(0, match.index) : text;
  const numStr = hasNumber ? match[0] : '';
  const after = hasNumber ? text.slice(match.index + numStr.length) : '';
  const target = hasNumber ? parseInt(numStr, 10) : 0;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !hasNumber || reduced) return;
      const numEl = el.querySelector('.metric__num');
      const counter = { v: 0 };

      gsap.to(counter, {
        v: target,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          numEl.textContent = String(Math.round(counter.v));
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });

      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <article className="metric" ref={ref} aria-label={text}>
      <p className="metric__value" aria-hidden="true">
        {before}
        {hasNumber && (
          <span className="metric__num">{reduced ? numStr : '0'}</span>
        )}
        {after}
      </p>
    </article>
  );
}
