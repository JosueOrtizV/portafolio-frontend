import '@splinetool/viewer';
import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef, signal } from '@angular/core';

@Component({
  selector: 'app-hero-3d-viewer',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Contenedor responsivo para el visor 3D de Spline -->
    <div class="w-full h-[220px] md:h-[320px] relative z-10 flex items-center justify-center spline-container">
      
      <!-- Spinner -->
      @if (isLoading()) {
        <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-transparent z-20">
          <div class="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }

      <spline-viewer
        #splineEl
        url="https://prod.spline.design/Po5Wk1W6RKGbNHVB/scene.splinecode"
        class="transition-opacity duration-1000 ease-in-out w-full h-full block"
        [class.opacity-0]="isLoading()"
        [class.opacity-100]="!isLoading()"
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
      overflow: visible !important;
    }
  `]
})
export class Hero3dViewerComponent implements AfterViewInit {
  @ViewChild('splineEl') splineEl!: ElementRef;
  isLoading = signal(true);

  ngAfterViewInit() {
    const el = this.splineEl?.nativeElement;

    if (el) {
      // 1. Escuchamos el evento de carga nativo del componente web de Spline
      el.addEventListener('load', () => this.onSplineLoaded());

      // 2. Polling de respaldo por si el evento load ya se disparó rápido (Caché)
      const checkInterval = setInterval(() => {
        if (!this.isLoading()) {
          clearInterval(checkInterval);
          return;
        }

        // Verificamos si Spline ya construyó el canvas en su Shadow DOM
        const shadow = el.shadowRoot;
        if (shadow && shadow.querySelector('#spline')) {
          clearInterval(checkInterval);
          this.onSplineLoaded();
        }
      }, 200);

      // 3. Fallback absoluto de seguridad (5 segundos)
      setTimeout(() => {
        if (this.isLoading()) {
          clearInterval(checkInterval);
          this.onSplineLoaded();
        }
      }, 5000);

    } else {
      setTimeout(() => this.onSplineLoaded(), 1000);
    }
  }

  private onSplineLoaded(): void {
    if (!this.isLoading()) return; // Evitar ejecuciones duplicadas

    this.hideSplineLogo();

    // Damos un diminuto margen para asegurar que el DOM del ShadowDOM aplicó los estilos
    setTimeout(() => {
      this.isLoading.set(false);
    }, 50);
  }

  private hideSplineLogo(): void {
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
        }
      }
    };

    // Aplicarlo inmediatamente
    checkAndHide();
    // Y un par de veces más por si los elementos del ShadowDOM se reconstruyen internamente
    setTimeout(checkAndHide, 500);
    setTimeout(checkAndHide, 1000);
  }
}
