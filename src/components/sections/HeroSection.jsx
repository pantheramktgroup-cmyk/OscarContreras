import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { brand, hero, oscar } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import PrimaryCTA from '../ui/PrimaryCTA.jsx';

export default function HeroSection() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return undefined;

      const logo = el.querySelector('.hero__logo');
      const eyebrow = el.querySelector('.hero__eyebrow');
      const titleInner = el.querySelector('.hero__title-inner');
      const sub = el.querySelector('.hero__subtitle');
      const visual = el.querySelector('.hero__visual');
      const mediaFrame = el.querySelector('.hero__media-frame');
      const photoBg = el.querySelector('.hero__photo-bg');
      const proof = el.querySelector('.hero__proof');
      const rings = el.querySelectorAll('.hero__visual-ring');
      const decorativeDots = el.querySelectorAll(
        '.hero__dot-grid, .hero__media-dots'
      );

      if (reduced) {
        gsap.set(
          [logo, eyebrow, sub, visual, mediaFrame, photoBg, proof, decorativeDots],
          { opacity: 1, x: 0, y: 0, scale: 1 }
        );
        gsap.set(titleInner, { yPercent: 0 });
        gsap.set(visual, { clipPath: 'inset(0 0 0 0)', scale: 1 });
        gsap.set(rings, { opacity: 1, scale: 1, rotation: 0 });
        return undefined;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(logo, {
        opacity: 0,
        y: -14,
        duration: 0.55,
      })
        .from(
          eyebrow,
          {
            opacity: 0,
            x: -16,
            duration: 0.5,
          },
          0.16
        )
        .from(
          titleInner,
          {
            yPercent: 112,
            duration: 0.9,
            ease: 'expo.out',
          },
          0.2
        )
        .from(
          sub,
          {
            opacity: 0,
            y: 18,
            duration: 0.65,
          },
          '-=0.48'
        )
        .fromTo(
          photoBg,
          {
            scale: 0.88,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            transformOrigin: 'center',
          },
          0.3
        )
        .from(
          mediaFrame,
          {
            opacity: 0,
            y: 24,
            scale: 0.97,
            duration: 0.82,
            ease: 'expo.out',
          },
          0.36
        )
        .fromTo(
          visual,
          {
            clipPath: 'inset(0 0 100% 0 round 28px)',
            scale: 1.045,
          },
          {
            clipPath: 'inset(0 0 0% 0 round 28px)',
            scale: 1,
            duration: 0.98,
            ease: 'expo.out',
          },
          0.42
        )
        .from(
          rings,
          {
            opacity: 0,
            scale: 0.72,
            duration: 0.72,
            stagger: 0.1,
            ease: 'back.out(1.35)',
          },
          '-=0.52'
        )
        .from(
          proof,
          {
            opacity: 0,
            x: -18,
            y: 12,
            duration: 0.62,
            ease: 'expo.out',
          },
          '-=0.46'
        )
        .from(
          decorativeDots,
          {
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
          },
          '-=0.45'
        );

      gsap.to('.hero__visual-ring', {
        rotation: 5,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'center',
      });

      gsap.to('.hero__proof', {
        y: -5,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const media = el.querySelector('.hero__media');
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

      if (!media || !hasFinePointer) return undefined;

      const frameX = gsap.quickTo(mediaFrame, 'x', {
        duration: 0.55,
        ease: 'power3.out',
      });
      const frameY = gsap.quickTo(mediaFrame, 'y', {
        duration: 0.55,
        ease: 'power3.out',
      });
      const ringX = gsap.quickTo(rings, 'x', {
        duration: 0.7,
        ease: 'power3.out',
      });
      const ringY = gsap.quickTo(rings, 'y', {
        duration: 0.7,
        ease: 'power3.out',
      });

      const handlePointerMove = (event) => {
        const rect = media.getBoundingClientRect();
        const normalizedX =
          ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const normalizedY =
          ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        frameX(normalizedX * 6);
        frameY(normalizedY * 5);
        ringX(normalizedX * 10);
        ringY(normalizedY * 8);
      };

      const resetPointer = () => {
        frameX(0);
        frameY(0);
        ringX(0);
        ringY(0);
      };

      media.addEventListener('pointermove', handlePointerMove);
      media.addEventListener('pointerleave', resetPointer);

      return () => {
        media.removeEventListener('pointermove', handlePointerMove);
        media.removeEventListener('pointerleave', resetPointer);
      };
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <header className="hero" ref={ref}>
      <span className="hero__ambient hero__ambient--red" aria-hidden="true" />
      <span className="hero__ambient hero__ambient--navy" aria-hidden="true" />
      <span className="hero__dot-grid" aria-hidden="true" />

      <div className="shell hero__inner">
        <img
          className="hero__logo"
          src={brand.logo}
          alt={brand.logoAlt}
          width="200"
          height="64"
          fetchPriority="high"
        />

        <div className="hero__grid">
          <div className="hero__content">
            <span className="hero__eyebrow">
              <span className="hero__eyebrow-bar" aria-hidden="true" />
              Impulso Laboral
            </span>

            <h1 className="hero__title">
              <span className="hero__title-mask">
                <span className="hero__title-inner">
                  <span className="hero__title-line">Alcanza tu próximo</span>
                  <span className="hero__title-line hero__accent">
                    Cargo Estratégico
                  </span>
                  <span className="hero__title-line">
                    en la mitad del tiempo
                  </span>
                </span>
              </span>
            </h1>

            <p className="hero__subtitle">{hero.subtitle}</p>
            <PrimaryCTA className="hero__cta" />
          </div>

          <div className="hero__media">
            <span className="hero__photo-bg" aria-hidden="true" />
            <span className="hero__media-outline" aria-hidden="true" />

            <div className="hero__media-frame">
              <figure className="hero__visual">
                <img
                  src={oscar.primary}
                  alt="Oscar Contreras, Director de Empodera Consulting Group"
                  width="620"
                  height="760"
                  fetchPriority="high"
                />
              </figure>

              <div className="hero__proof">
                <span className="hero__proof-mark" aria-hidden="true">
                  “
                </span>

                <span className="hero__proof-copy">
                  <span>Métodos probados.</span>
                  <span>Resultados reales.</span>
                  <span>Impacto duradero.</span>
                </span>
              </div>
            </div>

            <span className="hero__visual-ring" aria-hidden="true" />
            <span
              className="hero__visual-ring hero__visual-ring--2"
              aria-hidden="true"
            />
            <span className="hero__media-dots" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}