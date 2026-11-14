import { useReducedMotion } from './useReducedMotion.js';
import { useLiteMotion } from './useLiteMotion.js';

// true cuando NO hay que animar con GSAP: el usuario pidió menos movimiento
// o es un celular/tablet (modo liviano). En esos casos el contenido se
// muestra completo desde el inicio, sin esperar al scroll.
export function useStaticMotion() {
  const reduced = useReducedMotion();
  const lite = useLiteMotion();
  return reduced || lite;
}
