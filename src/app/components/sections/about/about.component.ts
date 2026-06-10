import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  public readonly i18n = inject(I18nService);
  public readonly api = inject(ApiService);

  public readonly profile = toSignal(this.api.getProfile(), { initialValue: null });

  constructor() {
    effect(() => {
      const profileData = this.profile();
      if (profileData) {
        setTimeout(() => {
          this.initScrollAnimations();
        }, 100);
      }
    });
  }

  getBioSentences(profileData: any): string[] {
    const bio = this.i18n.getText(profileData.biography, profileData.biography_en);
    if (!bio) return [];
    return bio
      .split(/\.(?=\s|$)/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s.endsWith('.') ? s : s + '.');
  }

  // Public signal for logs used in about.component.html
  public logs = signal<string[]>([
    '[08:00:00] INITIALIZING_ENVIRONMENT...',
    '[08:00:04] FRONTEND_MODULE_LOADED_OK',
    '[08:00:09] BACKEND_SYNERGY_SYNCED',
    '[08:00:15] MECHATRONIC_OVERLAY_ACTIVE'
  ]);

  private readonly incomingLogs = [
    '[09:12:44] UPDATING_SKILL_MATRIX...',
    '[09:15:22] CACHE_CLEARED_SYSTEM_STABLE',
    '[09:18:01] NEW_CONNECTION_DETECTED',
    '[09:20:55] RENDER_PIPELINE_COMPLETE'
  ];

  private logIndex = 0;
  private intervalId: any = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const nextLog = this.incomingLogs[this.logIndex % this.incomingLogs.length];
      this.logIndex++;

      this.logs.update(currentLogs => {
        const updated = [...currentLogs, nextLog];
        if (updated.length > 4) {
          updated.shift();
        }
        return updated;
      });
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Limpiar ScrollTriggers para evitar leaks de memoria
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private initScrollAnimations() {
    // 1. Animación del avatar (izquierda)
    gsap.to('.about-avatar-window', {
      opacity: 1,
      x: 0,
      startAt: { x: -40, opacity: 0 },
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 2. Animación de la tarjeta de perfil (derecha)
    gsap.to('.about-profile-card', {
      opacity: 1,
      x: 0,
      startAt: { x: 40, opacity: 0 },
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        // Animar los items de biografía en secuencia
        gsap.to('.about-bio-item', {
          opacity: 1,
          x: 0,
          startAt: { x: -10, opacity: 0 },
          stagger: 0.12,
          duration: 0.4,
          ease: 'power1.out'
        });

        // Animar los highlights
        gsap.to('.about-highlight-item', {
          opacity: 1,
          scale: 1,
          startAt: { scale: 0.95, opacity: 0 },
          stagger: 0.08,
          duration: 0.4,
          ease: 'back.out(1.2)'
        });
      }
    });

    // 3. Tarjetas de contacto y logs (abajo)
    gsap.to('.about-contact-card', {
      opacity: 1,
      y: 0,
      startAt: { y: 30, opacity: 0 },
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-contact-card',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    gsap.to('.about-logs-card', {
      opacity: 1,
      y: 0,
      startAt: { y: 30, opacity: 0 },
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-logs-card',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }
}
