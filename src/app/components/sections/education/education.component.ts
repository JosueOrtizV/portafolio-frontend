import { Component, inject, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Education } from '../../../core/models/portfolio.models';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);
  
  protected readonly educations = toSignal(this.api.getEducations(), { initialValue: [] as Education[] });

  constructor() {
    effect(() => {
      const eduData = this.educations();
      if (eduData && eduData.length > 0) {
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

  protected formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = this.i18n.language() === 'es' 
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  protected getCardClasses(index: number): string {
    // Alternates between magenta and purple shadows for visual interest
    return index % 2 === 0 
      ? 'voxel-shadow-magenta hover:shadow-[8px_8px_0px_0px_rgba(254,0,254,1)]' 
      : 'voxel-shadow-purple hover:shadow-[12px_12px_0px_0px_rgba(149,0,223,1)]';
  }

  private initScrollAnimations() {
    // 1. Draw vertical tree line on desktop
    gsap.to('.education-tree-line', {
      scaleY: 1,
      duration: 0.8,
      ease: 'none',
      scrollTrigger: {
        trigger: '#education',
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: true
      }
    });

    // 2. Animate education cards entry
    gsap.to('.education-item', {
      opacity: 1,
      x: 0,
      startAt: { x: 30, opacity: 0 },
      stagger: 0.2,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#education',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
  }
}
