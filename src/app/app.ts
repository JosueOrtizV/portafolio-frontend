import { Component, signal, OnInit, inject, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeroComponent } from './components/sections/hero/hero.component';
import { AboutComponent } from './components/sections/about/about.component';
import { SkillsComponent } from './components/sections/skills/skills.component';
import { ProjectsComponent } from './components/sections/projects/projects.component';
import { ExperienceComponent } from './components/sections/experience/experience.component';
import { EducationComponent } from './components/sections/education/education.component';
import { CertificationsComponent } from './components/sections/certifications/certifications.component';
import { ContactComponent } from './components/sections/contact/contact.component';
import { ApiService } from './core/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    EducationComponent,
    CertificationsComponent,
    ContactComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'Josué Ortiz - Portfolio';
  private api = inject(ApiService);
  
  isLoading = signal(true);
  showScrollTop = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Mostrar el botón si el scroll es mayor a 300px
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollTop.set(scrollPosition > 300);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  async ngOnInit() {
    try {
      // Cargar datos iniciales y luego ocultar el loading
      await Promise.all([
        firstValueFrom(this.api.getProfile()),
        firstValueFrom(this.api.getProjects()),
        firstValueFrom(this.api.getSkills()),
        firstValueFrom(this.api.getExperiences()),
        firstValueFrom(this.api.getEducations()),
        firstValueFrom(this.api.getCertifications())
      ]);
      
      // Pequeño delay para que se vea el loading
      setTimeout(() => {
        this.isLoading.set(false);
      }, 500);
    } catch (error) {
      // Si hay error, ocultar el loading de todas formas
      setTimeout(() => {
        this.isLoading.set(false);
      }, 500);
    }
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }
}
