import SectionShell from '../layout/SectionShell.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import LogoMarquee from '../ui/LogoMarquee.jsx';
import { clientLogos, companyLogos } from '../../data/content.js';

export default function ClientLogosSection() {
  return (
    <SectionShell variant="white" className="clients">
      <SectionHeading align="center" className="clients__heading">
        {clientLogos.title}
      </SectionHeading>
      <div className="clients__panel">
        <span className="clients__dot clients__dot--tl" aria-hidden="true" />
        <span className="clients__dot clients__dot--br" aria-hidden="true" />
        <div className="clients__marquee">
          <LogoMarquee logos={companyLogos} />
        </div>
      </div>
    </SectionShell>
  );
}
