// Registro único de GSAP y plugins. Importar desde aquí en toda la app.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

// En celulares la barra del navegador aparece y desaparece al hacer scroll y
// cambia el alto de la ventana. Sin esto, ScrollTrigger recalcula todo cada vez.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, ScrollToPlugin, useGSAP };
