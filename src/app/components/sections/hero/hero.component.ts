import { Component, inject, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero3dViewerComponent } from './hero-3d-viewer/hero-3d-viewer.component';

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
