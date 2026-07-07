import SectionShell from '../layout/SectionShell.jsx';
import Reveal from '../ui/Reveal.jsx';
import PrimaryCTA from '../ui/PrimaryCTA.jsx';
import { evaluation } from '../../data/content.js';

// Momento de decisión: bloque editorial centrado con mucho aire.
export default function EvaluationSection() {
  return (
    <SectionShell variant="light" className="evaluation">
      <Reveal className="evaluation__inner" stagger>
        <p className="evaluation__eyebrow">Evaluación estratégica</p>
        <h2 className="evaluation__title">{evaluation.title}</h2>
        <p className="evaluation__text">{evaluation.text}</p>
        <PrimaryCTA className="evaluation__cta" />
      </Reveal>
    </SectionShell>
  );
}
