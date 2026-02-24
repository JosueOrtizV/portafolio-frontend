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
      overflow: visible;
    }

    spline-viewer {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }
  `]
})
export class Hero3dViewerComponent implements AfterViewInit {
  @ViewChild('splineEl') splineEl!: ElementRef;

  ngAfterViewInit() {
    this.hideSplineLogo();
  }

  private hideSplineLogo(): void {
    // El logo está en el Shadow DOM, necesitamos acceder ahí con JS
    const checkAndHide = () => {
      const el = this.splineEl?.nativeElement;
      if (!el) return;

      const shadow = el.shadowRoot;
      if (shadow) {
        const logo = shadow.querySelector('#logo');
        if (logo) {
          // Spline a veces fuerza el display, así que usamos un enfoque más agresivo
          const logoEl = logo as HTMLElement;
          logoEl.style.setProperty('display', 'none', 'important');
          logoEl.style.opacity = '0';
          logoEl.style.visibility = 'hidden';
          logoEl.style.pointerEvents = 'none';

          // O intentar removerlo del DOM directamente
          try {
            logoEl.remove();
          } catch (e) { }

          return; // Logo encontrado y ocultado
        }
      }
      // Si aún no existe (la escena sigue cargando), reintentar
      requestAnimationFrame(checkAndHide);
    };

    // Esperar a que el viewer se monte completamente
    setTimeout(() => checkAndHide(), 1000);
  }
}
