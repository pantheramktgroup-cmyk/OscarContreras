import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import SectionShell from '../layout/SectionShell.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import PrimaryCTA from '../ui/PrimaryCTA.jsx';
import { differentiators } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

// Resalta un fragmento (p. ej. "50%") sin inventar texto.
function withEmphasis(text, emphasis) {
  if (!emphasis || !text.includes(emphasis)) return text;
  const [before, after] = text.split(emphasis);
  return (
    <>
      {before}
      <strong className="diff__emphasis">{emphasis}</strong>
      {after}
    </>
  );
}

function withHighlight(text, marker, className) {
  if (!marker || !text.includes(marker)) return text;
  const [before, after] = text.split(marker);
  return (
    <>
      {before}
      <strong className={className}>{marker}</strong>
      {after}
    </>
  );
}

export default function DifferentiatorsSection() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const cards = el.querySelectorAll('.diff__card');
      gsap.from(cards, {
        opacity: 0,
        y: 28,
        duration: 0.68,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.diff__cards', start: 'top 78%', once: true },
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <SectionShell variant="light" className="diff">
      <div ref={ref}>
        <SectionHeading className="diff__heading">
          {withHighlight(
            differentiators.title,
            differentiators.titleHighlight,
            'diff__title-highlight'
          )}
        </SectionHeading>
        <p className="diff__intro">
          {withHighlight(
            differentiators.intro,
            differentiators.introHighlight,
            'diff__intro-strong'
          )}
        </p>
        <div className="diff__cards">
          {differentiators.items.map((item, i) => (
            <article className="diff__card" key={item.title}>
              <span className="diff__glow" aria-hidden="true" />
              <span className="diff__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="diff__card-title">{item.title}</h3>
              <p className="diff__card-text">
                {withEmphasis(item.text, item.emphasis)}
              </p>
            </article>
          ))}
        </div>
        <div className="diff__cta-wrap">
          <PrimaryCTA className="diff__cta" />
        </div>
      </div>
    </SectionShell>
  );
}
