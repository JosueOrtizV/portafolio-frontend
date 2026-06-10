import { Component, inject, OnDestroy, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Certification } from '../../../core/models/portfolio.models';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css'
})
export class CertificationsComponent implements OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);

  protected readonly certifications = toSignal(this.api.getCertifications(), { initialValue: [] as Certification[] });
  protected readonly profile = toSignal(this.api.getProfile(), { initialValue: null });

  constructor() {
    effect(() => {
      const certsData = this.certifications();
      if (certsData && certsData.length > 0) {
        setTimeout(() => {
          this.initScrollAnimations();
        }, 150);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar ScrollTriggers para evitar leaks de memoria
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  protected formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = this.i18n.language() === 'es'
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  private initScrollAnimations() {
    // 1. Stagger certifications cards
    gsap.to('.certifications-card', {
      opacity: 1,
      y: 0,
      startAt: { y: 35, opacity: 0 },
      stagger: 0.12,
      duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#certifications',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 2. Animate certifications button
    gsap.to('.certifications-button', {
      opacity: 1,
      y: 0,
      startAt: { y: 20, opacity: 0 },
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.certifications-button',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 3. Animate technical visualization svg container
    gsap.to('.certifications-visualization', {
      opacity: 1,
      scale: 1,
      startAt: { scale: 0.96, opacity: 0 },
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.certifications-visualization',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
}
