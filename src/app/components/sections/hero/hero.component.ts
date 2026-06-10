import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero3dViewerComponent } from './hero-3d-viewer/hero-3d-viewer.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, Hero3dViewerComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);

  protected readonly profile = toSignal(this.api.getProfile(), { initialValue: null });

  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef<HTMLElement>;

  constructor() {
    effect(() => {
      const profileData = this.profile();
      if (profileData) {
        // Esperar a que Angular actualice la directiva @if en el DOM
        setTimeout(() => {
          this.animateHero();
        }, 100);
      }
    });
  }

  ngOnInit() {
    this.setHeroHeight();
    // Recalcular cuando cambie la orientación o el tamaño de la ventana
    window.addEventListener('resize', this.setHeroHeight);
    window.addEventListener('orientationchange', this.setHeroHeight);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setHeroHeight);
    window.removeEventListener('orientationchange', this.setHeroHeight);
  }

  private animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-badge', { opacity: 1, y: 0, startAt: { y: -15, opacity: 0 }, duration: 0.5 })
      .to('.hero-name', { opacity: 1, y: 0, startAt: { y: 25, opacity: 0 }, duration: 0.7 }, '-=0.3')
      .to('.hero-role', { opacity: 1, y: 0, startAt: { y: 15, opacity: 0 }, duration: 0.6 }, '-=0.4')
      .to('.hero-tagline', { opacity: 1, x: 0, startAt: { x: -25, opacity: 0 }, duration: 0.6 }, '-=0.4')
      .to('.hero-ctas', { opacity: 1, y: 0, startAt: { y: 15, opacity: 0 }, duration: 0.5 }, '-=0.3')
      .to('.hero-window', { opacity: 1, scale: 1, startAt: { scale: 0.97, opacity: 0 }, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.5');
  }

  private setHeroHeight = () => {
    if (this.heroSection?.nativeElement) {
      // Usar la altura real del viewport
      const vh = window.innerHeight * 0.01;
      const realHeight = window.innerHeight;

      // Establecer altura usando CSS custom property
      this.heroSection.nativeElement.style.setProperty('--vh', `${vh}px`);
      this.heroSection.nativeElement.style.height = `${realHeight}px`;
    }
  };
}
