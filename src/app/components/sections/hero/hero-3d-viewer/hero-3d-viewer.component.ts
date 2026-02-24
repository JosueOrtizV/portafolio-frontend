import '@splinetool/viewer';
import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero-3d-viewer',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Contenedor responsivo para el visor 3D de Spline -->
    <div class="w-full h-[220px] md:h-[320px] relative z-10 spline-container">
      <spline-viewer
        #splineEl
        url="https://prod.spline.design/Po5Wk1W6RKGbNHVB/scene.splinecode"
      ></spline-viewer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .spline-container {
      overflow: visible !important;
      transform-style: preserve-3d;
    }

    spline-viewer {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible !important;
    }
  `]
})
export class Hero3dViewerComponent implements AfterViewInit {
  @ViewChild('splineEl') splineEl!: ElementRef;

  ngAfterViewInit() {
    this.hideSplineLogo();
  }

  private hideSplineLogo(): void {
    // El logo y el canvas están en el Shadow DOM, necesitamos acceder ahí con JS
    const checkAndHide = () => {
      const el = this.splineEl?.nativeElement;
      if (!el) return;

      const shadow = el.shadowRoot;
      if (shadow) {
        // 1. Ocultar el Logo
        const logo = shadow.querySelector('#logo');
        if (logo) {
          const logoEl = logo as HTMLElement;
          logoEl.style.setProperty('display', 'none', 'important');
          logoEl.style.opacity = '0';
          logoEl.style.visibility = 'hidden';
          logoEl.style.pointerEvents = 'none';
          try {
            logoEl.remove();
          } catch (e) { }
        }

        // 2. Arreglar el recorte (overflow) oculto en producción
        const container = shadow.querySelector('#container') as HTMLElement;
        const canvas = shadow.querySelector('#spline') as HTMLElement;
        if (container) {
          container.style.overflow = 'visible';
          container.style.setProperty('overflow', 'visible', 'important');
        }
        if (canvas) {
          canvas.style.overflow = 'visible';
          canvas.style.setProperty('overflow', 'visible', 'important');

          if (logo || container || canvas) {
            return;
          }
        }
      }

      // Si aún no existe (la escena sigue cargando), reintentar
      requestAnimationFrame(checkAndHide);
    };

    // Esperar a que el viewer se monte completamente
    setTimeout(() => checkAndHide(), 1000);
  }
}
