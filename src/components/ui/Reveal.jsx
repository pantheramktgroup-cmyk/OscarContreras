import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

// Reveal accesible: el contenido queda visible si JS falla (el estado inicial
// oculto solo se aplica desde GSAP). Anima opacity + y al entrar en viewport.
export default function Reveal({
  children,
  as = 'div',
  stagger = false,
  y = 28,
  delay = 0,
  className = '',
  ...rest
}) {
  const Tag = as;
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? el.children : el;

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        stagger: stagger ? 0.09 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
