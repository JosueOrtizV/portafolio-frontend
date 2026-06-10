import { Component, inject, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Skill } from '../../../core/models/portfolio.models';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit, OnDestroy {
  public readonly i18n = inject(I18nService);
  public readonly api = inject(ApiService);

  public readonly skills = toSignal(this.api.getSkills(), { initialValue: [] as Skill[] });

  constructor() {
    effect(() => {
      const skillsData = this.skills();
      if (skillsData && skillsData.length > 0) {
        setTimeout(() => {
          this.initScrollAnimations();
        }, 150);
      }
    });
  }

  public readonly frontendSkills = computed(() => 
    this.skills().filter(skill => skill.category === 'frontend' && skill.is_active)
  );

  public readonly frontendSkillsFirstHalf = computed(() => {
    const list = this.frontendSkills();
    return list.slice(0, Math.ceil(list.length / 2));
  });

  public readonly frontendSkillsSecondHalf = computed(() => {
    const list = this.frontendSkills();
    return list.slice(Math.ceil(list.length / 2));
  });

  public readonly backendSkills = computed(() => 
    this.skills().filter(skill => skill.category === 'backend' && skill.is_active)
  );


  public readonly databaseSkills = computed(() => 
    this.skills().filter(skill => skill.category === 'database' && skill.is_active)
  );

  public readonly toolsSkills = computed(() => 
    this.skills().filter(skill => skill.category === 'tools' && skill.is_active)
  );

  public readonly softSkills = computed(() => 
    this.skills().filter(skill => skill.skill_type === 'soft' && skill.is_active)
  );

  public readonly hardSkills = computed(() => 
    this.skills().filter(skill => skill.skill_type === 'hard' && skill.is_active)
  );

  public readonly averageFrontendLevel = computed(() => {
    const list = this.frontendSkills();
    if (list.length === 0) return 98;
    const sum = list.reduce((acc, skill) => acc + skill.level, 0);
    return Math.round(sum / list.length);
  });

  public readonly logs = signal<string[]>([
    '> Initializing skills_scan...',
    '> Loading environment: JO_OS_v1.0.4',
    '> Component: Frontend_Layer ... [OK]',
    '> Component: Backend_Kernel ... [OK]',
    '> Component: Hardware_Bridge ... [LINKED]',
    '> Syncing neural_links with local_storage...',
    '> Error: Coffee_Level_Low ... [RETRYING]',
    '> Skill_Matrix: Fully functional.',
    '> Ready for connection.'
  ]);

  private readonly incomingLogs = [
    '> Fetching latest updates from git.josue.exe...',
    '> Deploying mechatronics package...',
    '> Security audit: Passed (124ms)',
    '> Optimization Level: High',
    '> System integrity verified.',
    '> Re-routing subnets...',
    '> Diagnostic dump complete.',
    '> Memory allocation optimized.'
  ];

  private intervalId: any = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const nextLog = this.incomingLogs[Math.floor(Math.random() * this.incomingLogs.length)];
      this.logs.update(currentLogs => {
        const updated = [...currentLogs, nextLog];
        // Keep the last 10 lines to fit in the terminal component without overflowing
        if (updated.length > 10) {
          updated.shift();
        }
        return updated;
      });
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Limpiar ScrollTriggers para evitar leaks de memoria
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private initScrollAnimations() {
    // 1. Frontend card (8-col)
    gsap.to('.skills-card-frontend', {
      opacity: 1,
      y: 0,
      startAt: { y: 35, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-card-frontend',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        gsap.to('.skills-frontend-item', {
          opacity: 1,
          x: 0,
          startAt: { x: -10, opacity: 0 },
          stagger: 0.04,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
    });

    // 2. Backend card (4-col)
    gsap.to('.skills-card-backend', {
      opacity: 1,
      y: 0,
      startAt: { y: 35, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-card-backend',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        gsap.to('.skills-backend-item', {
          opacity: 1,
          scale: 1,
          startAt: { scale: 0.8, opacity: 0 },
          stagger: 0.05,
          duration: 0.3,
          ease: 'back.out(1.5)'
        });
        
        gsap.to('.skills-db-item', {
          opacity: 1,
          x: 0,
          startAt: { x: -10, opacity: 0 },
          stagger: 0.06,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
    });

    // 3. Hardware card (6-col)
    gsap.to('.skills-card-hardware', {
      opacity: 1,
      y: 0,
      startAt: { y: 35, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-card-hardware',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        gsap.to('.skills-hw-item', {
          opacity: 1,
          x: 0,
          startAt: { x: -15, opacity: 0 },
          stagger: 0.08,
          duration: 0.35,
          ease: 'power1.out'
        });
      }
    });

    // 4. Tooling card (3-col)
    gsap.to('.skills-card-tooling', {
      opacity: 1,
      y: 0,
      startAt: { y: 35, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-card-tooling',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        gsap.to('.skills-tool-item', {
          opacity: 1,
          y: 0,
          startAt: { y: 10, opacity: 0 },
          stagger: 0.06,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    // 5. Soft Card (3-col)
    gsap.to('.skills-card-soft', {
      opacity: 1,
      y: 0,
      startAt: { y: 35, opacity: 0 },
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-card-soft',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        gsap.to('.skills-soft-item', {
          opacity: 1,
          x: 0,
          startAt: { x: -10, opacity: 0 },
          stagger: 0.06,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
    });

    // 6. Diagnostics terminal
    gsap.to('.skills-terminal', {
      opacity: 1,
      y: 0,
      startAt: { y: 40, opacity: 0 },
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-terminal',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }
}



