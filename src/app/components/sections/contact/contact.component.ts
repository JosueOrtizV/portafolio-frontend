import { Component, inject, signal, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);
  
  protected readonly profile = toSignal(this.api.getProfile(), { initialValue: null });
  
  protected readonly formData = signal({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  protected readonly isSubmitting = signal(false);
  protected readonly submitSuccess = signal(false);
  protected readonly submitError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const profileData = this.profile();
      if (profileData) {
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
  
  protected async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    this.submitError.set(null);
    
    try {
      await firstValueFrom(this.api.sendMessage(this.formData()));
      this.submitSuccess.set(true);
      this.formData.set({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);
    } catch (error) {
      this.submitError.set(this.i18n.language() === 'es' 
        ? 'Error al enviar el mensaje. Por favor, intenta de nuevo.' 
        : 'Error sending message. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private initScrollAnimations() {
    // 1. Animate left channels card
    gsap.to('.contact-channels-card', {
      opacity: 1,
      x: 0,
      startAt: { x: -30, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 2. Animate latency status bar
    gsap.to('.contact-latency-bar', {
      opacity: 1,
      y: 0,
      startAt: { y: 20, opacity: 0 },
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-latency-bar',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 3. Animate form card
    gsap.to('.contact-form-card', {
      opacity: 1,
      x: 0,
      startAt: { x: 30, opacity: 0 },
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }
}
