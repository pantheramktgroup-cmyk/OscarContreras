import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import SectionShell from '../layout/SectionShell.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { impact } from '../../data/content.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

function parseValue(value) {
  if (!value) return null;

  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    target: Number.parseInt(match[2], 10),
    suffix: match[3],
  };
}

function renderValue(value, key) {
  const parsed = parseValue(value);

  if (!parsed) {
    return (
      <span className="impact__highlight" key={key}>
        {value}
      </span>
    );
  }

  return (
    <span className="impact__highlight impact__highlight--value" key={key}>
      {parsed.prefix}

      <span
        className="impact__count"
        data-target={parsed.target}
        data-prefix=""
        data-suffix=""
      >
        0
      </span>

      {parsed.suffix}
    </span>
  );
}

function renderHighlightedCopy(item) {
  const text = item.full;
  const highlights = [...new Set(item.highlights ?? [])]
    .map((token) => ({
      token,
      index: text.indexOf(token),
    }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index);

  if (!highlights.length) {
    return text;
  }

  const nodes = [];
  let cursor = 0;

  highlights.forEach(({ token, index }, highlightIndex) => {
    if (index < cursor) {
      return;
    }

    if (index > cursor) {
      nodes.push(text.slice(cursor, index));
    }

    const valueInsideToken =
      item.value && token.includes(item.value);

    if (!valueInsideToken) {
      nodes.push(
        <span
          className="impact__highlight"
          key={`highlight-${highlightIndex}`}
        >
          {token}
        </span>
      );

      cursor = index + token.length;
      return;
    }

    const valuePosition = token.indexOf(item.value);
    const beforeValue = token.slice(0, valuePosition);
    const afterValue = token.slice(
      valuePosition + item.value.length
    );

    nodes.push(
      <span
        className="impact__highlight-group"
        key={`highlight-${highlightIndex}`}
      >
        {beforeValue}
        {renderValue(item.value, `value-${highlightIndex}`)}
        {afterValue}
      </span>
    );

    cursor = index + token.length;
  });

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

export default function ImpactSection() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;

      if (!root) {
        return;
      }

      const rows = root.querySelectorAll('.impact__item');
      const numbers = root.querySelectorAll('.impact__number');
      const counters = root.querySelectorAll(
        '.impact__count[data-target]'
      );
      const rule = root.querySelector('.impact__title-rule');

      if (reduced) {
        gsap.set([rows, numbers, rule], {
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
        });

        counters.forEach((counter) => {
          counter.textContent = counter.dataset.target ?? '0';
        });

        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 74%',
          once: true,
        },
      });

      timeline
        .fromTo(
          rule,
          {
            opacity: 0,
            scaleX: 0,
          },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.55,
            ease: 'expo.out',
          }
        )
        .from(
          rows,
          {
            opacity: 0,
            y: 18,
            duration: 0.58,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '-=0.22'
        )
        .from(
          numbers,
          {
            opacity: 0,
            x: -14,
            duration: 0.52,
            stagger: 0.06,
            ease: 'power3.out',
          },
          '<'
        );

      counters.forEach((counter) => {
        const target = Number.parseInt(
          counter.dataset.target,
          10
        );

        if (Number.isNaN(target)) {
          return;
        }

        const state = { value: 0 };

        gsap.to(state, {
          value: target,
          duration: 1.1,
          ease: 'power2.out',
          delay: 0.18,
          onUpdate: () => {
            counter.textContent = String(
              Math.round(state.value)
            );
          },
          scrollTrigger: {
            trigger: counter,
            start: 'top 84%',
            once: true,
          },
        });
      });
    },
    {
      scope: ref,
      dependencies: [reduced],
    }
  );

  return (
    <SectionShell variant="navy" className="impact">
      <div className="impact__inner" ref={ref}>
        <div className="impact__header-wrap">
          <SectionHeading
            eyebrow={impact.eyebrow}
            align="center"
            invert
            className="impact__heading"
          >
            {impact.title}
          </SectionHeading>

          <span
            className="impact__title-rule"
            aria-hidden="true"
          />
        </div>

        <ol
          className="impact__list"
          aria-label={impact.title}
        >
          {impact.items.map((item, index) => (
            <li className="impact__item" key={item.full}>
              <div
                className="impact__number-wrap"
                aria-hidden="true"
              >
                <span className="impact__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="impact__number-rule" />
              </div>

              <p className="impact__copy">
                {renderHighlightedCopy(item)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}