import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js';
import { CTA_LABEL, CTA_TARGET } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { usePointerCapability } from '../../hooks/usePointerCapability.js';
import './PrimaryCTA.css';

// Único componente de CTA. Todas las instancias son visualmente idénticas,
// comparten animación de entrada, hover, focus y destino (#agenda).
export default function PrimaryCTA({ className = '' }) {
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const labelRef = useRef(null);
  const reduced = useReducedMotion();
  const finePointer = usePointerCapability();

  useGSAP(
    (context, contextSafe) => {
      const btn = btnRef.current;
      if (!btn) return;

      const halo = btn.querySelector('.cta__halo');
      const sweep = btn.querySelector('.cta__sweep');
      const chevrons = btn.querySelectorAll('.cta__chev');

      // Entrada al entrar en viewport (una sola vez).
      if (reduced) {
        gsap.set(btn, { opacity: 1 });
        ScrollTrigger.create({
          trigger: btn,
          start: 'top 92%',
          once: true,
          onEnter: () => gsap.to(btn, { opacity: 1, duration: 0.4 }),
        });
      } else {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
        });
        tl.fromTo(
          btn,
          { scale: 0.82, opacity: 0, y: 14 },
          { scale: 1.04, opacity: 1, y: 0, duration: 0.42 }
        )
          .to(btn, { scale: 1, duration: 0.28, ease: 'power2.out' })
          .fromTo(
            halo,
            { scale: 0.4, opacity: 0.55 },
            { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out' },
            0
          )
          .fromTo(
            chevrons,
            { x: -6, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.32, stagger: 0.06 },
            0.28
          )
          .fromTo(
            sweep,
            { xPercent: -140 },
            { xPercent: 140, duration: 0.7, ease: 'power2.inOut' },
            0.3
          );

        ScrollTrigger.create({
          trigger: btn,
          start: 'top 90%',
          once: true,
          onEnter: () => tl.play(),
        });
      }

      // Magnetismo + hover solo con puntero fino.
      if (finePointer && !reduced) {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });

        const onMove = contextSafe((e) => {
          const r = btn.getBoundingClientRect();
          const relX = e.clientX - (r.left + r.width / 2);
          const relY = e.clientY - (r.top + r.height / 2);
          xTo(gsap.utils.clamp(-7, 7, relX * 0.35));
          yTo(gsap.utils.clamp(-6, 6, relY * 0.35));
        });
        const onLeave = contextSafe(() => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          });
        });

        btn.addEventListener('pointermove', onMove);
        btn.addEventListener('pointerleave', onLeave);

        return () => {
          btn.removeEventListener('pointermove', onMove);
          btn.removeEventListener('pointerleave', onLeave);
        };
      }
    },
    { scope: rootRef, dependencies: [reduced, finePointer] }
  );

  const handleClick = (e) => {
    const target = document.querySelector(CTA_TARGET);
    if (!target) return; // deja que el href navegue normalmente
    e.preventDefault();
    if (reduced) {
      target.scrollIntoView();
    } else {
      gsap.to(window, {
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTo: { y: target, offsetY: 24 },
      });
    }
    // enfoca el destino para accesibilidad de teclado
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  return (
    <div className={`cta-wrap ${className}`} ref={rootRef}>
      <a
        ref={btnRef}
        href={CTA_TARGET}
        className="cta"
        onClick={handleClick}
        aria-label={`${CTA_LABEL} — agendar evaluación estratégica`}
      >
        <span className="cta__halo" aria-hidden="true" />
        <span className="cta__sweep" aria-hidden="true" />
        <span className="cta__label" ref={labelRef}>
          {CTA_LABEL}
        </span>
        <span className="cta__chevrons" aria-hidden="true">
          <span className="cta__chev">›</span>
          <span className="cta__chev">›</span>
        </span>
      </a>
    </div>
  );
}
