import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import SectionShell from '../layout/SectionShell.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import PrimaryCTA from '../ui/PrimaryCTA.jsx';
import { painPoints } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

export default function PainPointsSection() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = el.querySelectorAll('.pain__item');
      const progress = el.querySelector('.pain__progress-fill');
      const closingPanel = el.querySelector('.pain__closing-panel');
      const listWrap = el.querySelector('.pain__list-wrap');

      if (reduced) {
        gsap.set(items, { opacity: 1, x: 0, y: 0 });
        gsap.set(progress, { scaleY: 1 });
        gsap.set(closingPanel, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(items, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: listWrap,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.fromTo(
        progress,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: listWrap,
            start: 'top 72%',
            end: 'bottom 65%',
            scrub: 1,
          },
        }
      );

      gsap.from(closingPanel, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: closingPanel,
          start: 'top 88%',
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <SectionShell variant="white" className="pain">
      <div className="pain__layout" ref={ref}>
        <div className="pain__head">
          <SectionHeading className="pain__heading">
            {painPoints.title}
          </SectionHeading>
        </div>

        <div className="pain__list-wrap">
          <span className="pain__progress" aria-hidden="true">
            <span className="pain__progress-fill" />
          </span>

          <ul className="pain__list">
            {painPoints.items.map((item, index) => (
              <li className="pain__item" key={item}>
                <span className="pain__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="pain__text">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pain__closing-panel">
          <p className="pain__closing">{painPoints.closing}</p>
          <PrimaryCTA className="pain__cta" />
        </div>
      </div>
    </SectionShell>
  );
}