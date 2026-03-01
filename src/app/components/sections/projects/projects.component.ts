import { Component, inject, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  animations: [
    trigger('staggerCards', [
      transition(':enter', [
        query('.bento-card', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger(120, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProjectsComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);

  protected readonly projects = toSignal(this.api.getProjects(), { initialValue: [] as Project[] });

  // Control de visibilidad para las animaciones
  protected cardsVisible = signal(false);

  @ViewChild('projectsSection') projectsSection!: ElementRef<HTMLElement>;

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

  protected getFeaturedProjects(): Project[] {
    return this.projects().filter(p => p.is_featured).slice(0, 3);
  }

  protected getAllProjects(): Project[] {
    // Excluir los proyectos destacados de la lista completa para evitar duplicados
    const featuredIds = this.getFeaturedProjects().map(p => p.id);
    return this.projects().filter(p => !featuredIds.includes(p.id));
  }

  protected selectedProject = signal<Project | null>(null);
  protected showProjectModal = signal(false);
  protected selectedImageIndex = signal(0);

  protected openProject(project: Project): void {
    this.selectedProject.set(project);
    this.selectedImageIndex.set(0);
    this.showProjectModal.set(true);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  protected closeProjectModal(): void {
    this.showProjectModal.set(false);
    this.selectedProject.set(null);
    this.selectedImageIndex.set(0);
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }

  protected getProjectImages(): string[] {
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

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected nextImage(): void {
    const images = this.getProjectImages();
    const currentIndex = this.selectedImageIndex();
    if (currentIndex < images.length - 1) {
      this.selectedImageIndex.set(currentIndex + 1);
    } else {
      this.selectedImageIndex.set(0);
    }
  }

  protected previousImage(): void {
    const images = this.getProjectImages();
    const currentIndex = this.selectedImageIndex();
    if (currentIndex > 0) {
      this.selectedImageIndex.set(currentIndex - 1);
    } else {
      this.selectedImageIndex.set(images.length - 1);
    }
  }
}

