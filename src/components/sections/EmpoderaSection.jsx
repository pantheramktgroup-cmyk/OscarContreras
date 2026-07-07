import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import SectionShell from '../layout/SectionShell.jsx';
import { empodera } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

export default function EmpoderaSection() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const titleWords = empodera.title.trim().split(/\s+/);
  const titleAccent = titleWords[0];
  const titleRest = titleWords.slice(1).join(' ');

  useGSAP(
    () => {
      const el = ref.current;

      if (!el) {
        return;
      }

      const headerChildren = el.querySelectorAll('.emp__header > *');
      const pillars = el.querySelectorAll('.emp__pillar');

      if (reduced) {
        gsap.set([headerChildren, pillars], {
          opacity: 1,
          y: 0,
        });

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          once: true,
        },
      });

      timeline
        .from(headerChildren, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.12,
        })
        .from(
          pillars,
          {
            opacity: 0,
            y: 26,
            duration: 0.65,
            stagger: 0.09,
          },
          '-=0.25'
        );
    },
    {
      scope: ref,
      dependencies: [reduced],
    }
  );

  return (
    <SectionShell variant="navy" className="emp">
      <div ref={ref} className="emp__inner">
        <div className="emp__header">
          <h2 className="emp__title">
            <span className="emp__title-accent">{titleAccent}</span>

            {titleRest && (
              <>
                {' '}
                <span>{titleRest}</span>
              </>
            )}
          </h2>

          <p className="emp__subtitle">{empodera.subtitle}</p>
        </div>

        <div className="emp__pillars">
          {empodera.blocks.map((block, index) => (
            <article className="emp__pillar" key={block.title}>
              <span className="emp__pillar-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="emp__pillar-title">{block.title}</h3>

              <p className="emp__pillar-text">{block.text}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}