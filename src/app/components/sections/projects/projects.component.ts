import { Component, inject, signal, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Project } from '../../../core/models/portfolio.models';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  public readonly i18n = inject(I18nService);
  public readonly api = inject(ApiService);

  public readonly projects = toSignal(this.api.getProjects(), { initialValue: [] as Project[] });

  @ViewChild('projectsSection') projectsSection!: ElementRef<HTMLElement>;

  // Typewriter effect for header logs used in projects.component.html
  public systemLogText = signal<string>('');
  private typingIntervalId: any = null;

  constructor() {
    effect(() => {
      const projectsData = this.projects();
      if (projectsData && projectsData.length > 0) {
        setTimeout(() => {
          this.initScrollAnimations();
        }, 150);
      }
    });
  }

  ngOnInit() {
    const fullText = "SYSTEM_LOG: INITIALIZING_DATA_FETCH... [DONE]\nACCESSING REPOSITORY: VOXEL_CORE_V2";
    let currentIndex = 0;
    this.typingIntervalId = setInterval(() => {
      if (currentIndex < fullText.length) {
        this.systemLogText.update(val => val + fullText.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(this.typingIntervalId);
      }
    }, 15);
  }

  ngOnDestroy(): void {
    if (this.typingIntervalId) {
      clearInterval(this.typingIntervalId);
    }
    // Limpiar ScrollTriggers para evitar leaks de memoria
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  public getFeaturedProjects(): Project[] {
    return this.projects().filter(p => p.is_featured);
  }

  public getAllProjects(): Project[] {
    // Excluir los proyectos destacados de la lista completa para evitar duplicados
    const featuredIds = this.getFeaturedProjects().map(p => p.id);
    return this.projects().filter(p => !featuredIds.includes(p.id));
  }

  public selectedProject = signal<Project | null>(null);
  public showProjectModal = signal(false);
  public selectedImageIndex = signal(0);

  public openProject(project: Project): void {
    this.selectedProject.set(project);
    this.selectedImageIndex.set(0);
    this.showProjectModal.set(true);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    // Animar la entrada del modal
    setTimeout(() => {
      gsap.to('.projects-modal-container', {
        opacity: 1,
        scale: 1,
        y: 0,
        startAt: { scale: 0.92, y: 20, opacity: 0 },
        duration: 0.45,
        ease: 'back.out(1.2)',
        clearProps: 'transform' // Limpiar transforms para que la maquetación CSS/Flex retome control
      });
    }, 30);
  }

  public closeProjectModal(): void {
    this.showProjectModal.set(false);
    this.selectedProject.set(null);
    this.selectedImageIndex.set(0);
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  public handleEscapeKey(): void {
    if (this.showProjectModal()) {
      this.closeProjectModal();
    }
  }

  public getProjectImages(): string[] {
    const project = this.selectedProject();
    if (!project) return [];

    const images: string[] = [];
    if (project.image_principal) {
      images.push(project.image_principal);
    }
    if (project.images && project.images.length > 0) {
      // Agregar imágenes adicionales, evitando duplicar la principal
      project.images.forEach(img => {
        if (img && img !== project.image_principal && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    return images;
  }

  public selectImage(index: number): void {
    this.selectedImageIndex.set(index);
    this.scrollToActiveThumbnail();
  }

  public nextImage(): void {
    const images = this.getProjectImages();
    const currentIndex = this.selectedImageIndex();
    if (currentIndex < images.length - 1) {
      this.selectedImageIndex.set(currentIndex + 1);
    } else {
      this.selectedImageIndex.set(0);
    }
    this.scrollToActiveThumbnail();
  }

  public previousImage(): void {
    const images = this.getProjectImages();
    const currentIndex = this.selectedImageIndex();
    if (currentIndex > 0) {
      this.selectedImageIndex.set(currentIndex - 1);
    } else {
      this.selectedImageIndex.set(images.length - 1);
    }
    this.scrollToActiveThumbnail();
  }

  private scrollToActiveThumbnail(): void {
    setTimeout(() => {
      const track = document.querySelector('.thumbnail-track') as HTMLElement;
      const activeThumb = document.querySelector('.thumbnail-item-active') as HTMLElement;
      if (track && activeThumb) {
        // Use offsetLeft which is relative to the track (since track has relative positioning)
        const scrollLeft = activeThumb.offsetLeft - (track.clientWidth / 2) + (activeThumb.clientWidth / 2);
        
        track.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }, 50);
  }

  // Voxel card color class helper (purple, cyan, magenta rotation) used in template
  public getCardClasses(index: number): string {
    const schemes = [
      'purple border-on-tertiary-container voxel-shadow-purple',
      'cyan border-primary-container voxel-shadow-cyan',
      'magenta border-secondary-container voxel-shadow-magenta'
    ];
    return schemes[index % schemes.length];
  }

  // Voxel card icon color helper used in template
  public getIconColorClass(index: number): string {
    const colors = [
      'text-on-tertiary-container',
      'text-primary-container',
      'text-secondary-container'
    ];
    return colors[index % colors.length];
  }

  // Voxel card button border class helper used in template
  public getButtonBorderClass(index: number): string {
    const borders = [
      'border-on-tertiary-container text-on-tertiary-container hover:bg-on-tertiary-container hover:text-primary',
      'border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary-container',
      'border-secondary-container text-secondary-container hover:bg-secondary-container hover:text-on-secondary'
    ];
    return borders[index % borders.length];
  }

  // Voxel card icon helper used in template
  public getProjectIcon(project: Project): string {
    const techs = project.technologies.map(t => t.toLowerCase());
    if (techs.some(t => t.includes('api') || t.includes('logic') || t.includes('bot') || t.includes('ai') || t.includes('service') || t.includes('back'))) {
      return 'memory';
    }
    if (techs.some(t => t.includes('mail') || t.includes('message') || t.includes('chat') || t.includes('contact') || t.includes('auth'))) {
      return 'mail';
    }
    if (techs.some(t => t.includes('grid') || t.includes('layout') || t.includes('dashboard') || t.includes('game') || t.includes('voxel') || t.includes('front'))) {
      return 'grid_view';
    }
    return 'terminal';
  }

  private initScrollAnimations() {
    // 1. Animación para los proyectos destacados (featured)
    gsap.to('.projects-featured-card', {
      opacity: 1,
      y: 0,
      startAt: { y: 45, opacity: 0 },
      stagger: 0.15,
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 2. Animación para otros proyectos (other)
    const otherCards = document.querySelectorAll('.projects-other-card');
    if (otherCards.length > 0) {
      gsap.to('.projects-other-card', {
        opacity: 1,
        y: 0,
        startAt: { y: 40, opacity: 0 },
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-other-card',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  }
}


