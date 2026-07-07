import './SectionShell.css';

// Envoltorio de sección full-bleed con contenido centrado y variante de fondo.
export default function SectionShell({
  id,
  variant = 'white',
  children,
  className = '',
  tabIndex,
  as = 'section',
}) {
  const Tag = as;
  return (
    <Tag id={id} tabIndex={tabIndex} className={`section bg-${variant} ${className}`}>
      <div className="shell section__inner">{children}</div>
    </Tag>
  );
}
