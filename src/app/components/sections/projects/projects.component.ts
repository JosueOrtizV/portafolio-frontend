import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Project } from '../../../core/models/portfolio.models';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  animations: [
    trigger('staggerCards', [
      transition(':enter', [
        query('.voxel-card', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger(120, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly i18n = inject(I18nService);
  public readonly api = inject(ApiService);

  public readonly projects = toSignal(this.api.getProjects(), { initialValue: [] as Project[] });

  // Control de visibilidad para las animaciones
  public cardsVisible = signal(false);

  @ViewChild('projectsSection') projectsSection!: ElementRef<HTMLElement>;

  // Typewriter effect for header logs used in projects.component.html
  public systemLogText = signal<string>('');
  private typingIntervalId: any = null;

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

  ngAfterViewInit() {
    // Usar IntersectionObserver para activar la animación cuando la sección sea visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.cardsVisible()) {
            this.cardsVisible.set(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (this.projectsSection?.nativeElement) {
      observer.observe(this.projectsSection.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.typingIntervalId) {
      clearInterval(this.typingIntervalId);
    }
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
}


