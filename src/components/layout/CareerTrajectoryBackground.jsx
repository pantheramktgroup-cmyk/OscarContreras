import { useMemo, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { usePointerCapability } from '../../hooks/usePointerCapability.js';
import './CareerTrajectoryBackground.css';

// Fondo de "trayectoria estratégica": nodos y líneas derivados de los círculos
// rojos del logo. SVG liviano, parallax en scroll, reacción sutil al cursor en
// desktop, estático con prefers-reduced-motion. pointer-events: none.
const VIEW_W = 1440;
const VIEW_H = 1600;

function buildNodes(count) {
  // Distribución pseudo-aleatoria estable (semilla fija) para orden consistente.
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    nodes.push({
      x: 60 + rand() * (VIEW_W - 120),
      y: 40 + rand() * (VIEW_H - 80),
      r: 2.5 + rand() * 4.5,
      depth: 0.3 + rand() * 0.9, // factor de parallax
      accent: rand() > 0.72, // algunos nodos en rojo Empodera
    });
  }
  return nodes;
}

function buildLinks(nodes) {
  const links = [];
  for (let i = 0; i < nodes.length; i += 1) {
    // conecta cada nodo con el siguiente cercano para sugerir trayectoria
    let best = -1;
    let bestDist = Infinity;
    for (let j = i + 1; j < nodes.length; j += 1) {
      const d =
        (nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2;
      if (d < bestDist) {
        bestDist = d;
        best = j;
      }
    }
    if (best !== -1 && bestDist < 340 ** 2) {
      links.push([i, best]);
    }
  }
  return links;
}

export default function CareerTrajectoryBackground() {
  const rootRef = useRef(null);
  const groupRef = useRef(null);
  const svgRef = useRef(null);
  const reduced = useReducedMotion();
  const finePointer = usePointerCapability();

  const count = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 14;
    return 26;
  }, []);

  const { nodes, links } = useMemo(() => {
    const n = buildNodes(count);
    return { nodes: n, links: buildLinks(n) };
  }, [count]);

  useGSAP(
    (context, contextSafe) => {
      const group = groupRef.current;
      if (!group || reduced) return;

      const nodeEls = group.querySelectorAll('.ctb__node');

      // Deriva lenta e independiente por nodo (movimiento orgánico, no molesto).
      nodeEls.forEach((el, i) => {
        gsap.to(el, {
          x: gsap.utils.random(-14, 14),
          y: gsap.utils.random(-18, 18),
          duration: gsap.utils.random(6, 10),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.05,
        });
      });

      // Parallax en scroll: la capa se desplaza suavemente.
      const parallax = gsap.to(group, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // Reacción sutil al cursor (solo puntero fino). Se aplica al <svg>
      // para no chocar con el transform de parallax del grupo.
      let cleanupPointer;
      if (finePointer && svgRef.current) {
        const xTo = gsap.quickTo(svgRef.current, 'x', {
          duration: 0.9,
          ease: 'power3',
        });
        const yTo = gsap.quickTo(svgRef.current, 'y', {
          duration: 0.9,
          ease: 'power3',
        });
        const onMove = contextSafe((e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * 24);
          yTo(ny * 24);
        });
        window.addEventListener('pointermove', onMove);
        cleanupPointer = () => window.removeEventListener('pointermove', onMove);
      }

      return () => {
        parallax?.scrollTrigger?.kill();
        cleanupPointer?.();
      };
    },
    { scope: rootRef, dependencies: [reduced, finePointer] }
  );

  return (
    <div className="ctb" ref={rootRef} aria-hidden="true">
      <svg
        ref={svgRef}
        className="ctb__svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <g ref={groupRef} className="ctb__group">
          {links.map(([a, b], idx) => (
            <line
              key={`l-${idx}`}
              className="ctb__link"
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
            />
          ))}
          {nodes.map((n, idx) => (
            <circle
              key={`n-${idx}`}
              className={`ctb__node ${n.accent ? 'ctb__node--accent' : ''}`}
              cx={n.x}
              cy={n.y}
              r={n.r}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
