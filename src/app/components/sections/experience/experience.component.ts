import { Component, inject, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Experience } from '../../../core/models/portfolio.models';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);

  protected readonly experiences = toSignal(this.api.getExperiences(), { initialValue: [] as Experience[] });

  constructor() {
    effect(() => {
      const expData = this.experiences();
      if (expData && expData.length > 0) {
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

  protected getIndexLabel(index: number): string {
    return (index + 1).toString().padStart(2, '0');
  }

  protected getCardClasses(index: number): string {
    return index === 0 
      ? 'border-primary voxel-shadow-magenta hover:shadow-[8px_8px_0px_0px_rgba(254,0,254,1)]' 
      : 'border-primary shadow-[4px_4px_0px_0px_rgba(149,0,223,1)] hover:shadow-[8px_8px_0px_0px_rgba(149,0,223,1)]';
  }

  private initScrollAnimations() {
    const modules = document.querySelectorAll('.experience-module');

    modules.forEach((module) => {
      const indicator = module.querySelector('.experience-indicator');
      const card = module.querySelector('.experience-card');
      const line = module.querySelector('.experience-dot-line');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: module,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      tl.to(indicator, {
        opacity: 1,
        scale: 1,
        startAt: { scale: 0, opacity: 0 },
        duration: 0.4,
        ease: 'back.out(1.5)'
      })
      .to(card, {
        opacity: 1,
        x: 0,
        startAt: { x: 30, opacity: 0 },
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.2');

      if (line) {
        tl.to(line, {
          scaleY: 1,
          duration: 0.4,
          ease: 'none'
        });
      }
    });

    // Animate the bottom terminal log
    gsap.to('.experience-terminal', {
      opacity: 1,
      y: 0,
      startAt: { y: 30, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.experience-terminal',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }
}
