import { Component, signal, OnInit, inject, HostListener, OnDestroy, NgZone, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  
  // Loading status states
  isLoading = signal(true);
  loadingProgress = signal(0);
  loadingStatus = signal('CONNECTING_TO_DATABANK...');
  loadingTerminal = signal('CONNECTING_TO_DATABANK...');
  loadLevel = signal('86%');
  systemTime = signal('');
  
  showScrollTop = signal(false);

  private cleanupCursor?: () => void;
  private clockInterval?: any;
  private loadingTimeout?: any;
  private terminalInterval?: any;

  private statusLogs = [
    'CONNECTING_TO_DATABANK...',
    'FETCHING_BIOGRAPHY_MODULE...',
    'LOADING_SKILLS_MANIFEST...',
    'PARSING_PROJECTS_ARCHIVE...',
    'RETRIEVING_EXPERIENCE_LOGS...',
    'ESTABLISHING_CONTACT_PORT...',
    'STABILIZING_NEURAL_LINK...',
    'PORTFOLIO_LOADED.'
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Mostrar el botón si el scroll es mayor a 300px y la pantalla no está bloqueada (modal abierto)
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const isLocked = typeof document !== 'undefined' && document.body.style.overflow === 'hidden';
    this.showScrollTop.set(scrollPosition > 300 && !isLocked);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  isScrollLocked(): boolean {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return document.body.style.overflow === 'hidden';
    }
    return false;
  }


  private updateClock() {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    this.systemTime.set(`TIMESTAMP: ${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
  }

  private typeTerminal(text: string) {
    if (this.terminalInterval) {
      clearInterval(this.terminalInterval);
    }
    this.loadingTerminal.set('');
    let i = 0;
    this.terminalInterval = setInterval(() => {
      if (i < text.length) {
        this.loadingTerminal.update(current => current + text.charAt(i));
        i++;
      } else {
        clearInterval(this.terminalInterval);
      }
    }, 10);
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        const onMouseMove = (e: MouseEvent) => {
          const cursor = document.getElementById('cursor');
          if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
          }
        };

        const onMouseOver = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button'))) {
            const cursor = document.getElementById('cursor');
            if (cursor) cursor.classList.add('hovered');
          }
        };

        const onMouseOut = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button'))) {
            const cursor = document.getElementById('cursor');
            if (cursor) cursor.classList.remove('hovered');
          }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);

        this.cleanupCursor = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseover', onMouseOver);
          document.removeEventListener('mouseout', onMouseOut);
        };
      });

      // System Loader Logic:
      // Live Clock
      this.updateClock();
      this.clockInterval = setInterval(() => this.updateClock(), 1000);

      // Start simulation
      let progress = 0;
      let logIndex = 0;
      let apiLoaded = false;

      const runProgressSequence = () => {
        if (progress < 100) {
          // If api is not loaded, cap artificial loading at 95%
          const limit = apiLoaded ? 100 : 95;
          
          if (progress < limit) {
            progress += Math.floor(Math.random() * 5) + 3; // Increments of 3-7%
            if (progress > limit) progress = limit;
            this.loadingProgress.set(progress);
          }

          // Update load level percentage fluctuation
          this.loadLevel.set(`${80 + Math.floor(Math.random() * 15)}%`);

          // Update statuses based on progress brackets
          const bracket = Math.floor(progress / (100 / this.statusLogs.length));
          if (bracket !== logIndex && bracket < this.statusLogs.length) {
            logIndex = bracket;
            this.loadingStatus.set(this.statusLogs[logIndex]);
            this.typeTerminal(this.statusLogs[logIndex]);
          }

          this.loadingTimeout = setTimeout(runProgressSequence, Math.random() * 30 + 20);
        } else {
          this.loadingStatus.set('ACCESS_GRANTED');
          this.typeTerminal('BOOT_SEQUENCE_COMPLETE_');
          
          // Hide loader after a short delay
          this.loadingTimeout = setTimeout(() => {
            this.isLoading.set(false);
          }, 250);
        }
      };

      // Start the progress sequence animation
      this.typeTerminal(this.statusLogs[0]);
      this.loadingTimeout = setTimeout(runProgressSequence, 40);

      // Fetch the API data in parallel
      try {
        await Promise.all([
          firstValueFrom(this.api.getProfile()),
          firstValueFrom(this.api.getProjects()),
          firstValueFrom(this.api.getSkills()),
          firstValueFrom(this.api.getExperiences()),
          firstValueFrom(this.api.getEducations()),
          firstValueFrom(this.api.getCertifications())
        ]);
        apiLoaded = true;
      } catch (error) {
        console.error('Loader API load error:', error);
        apiLoaded = true; // Still allow app to load
      }
    } else {
      // In non-browser platforms (SSR), disable loading screen immediately
      this.isLoading.set(false);
    }
  }

  ngOnDestroy() {
    if (this.cleanupCursor) {
      this.cleanupCursor();
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    if (this.terminalInterval) {
      clearInterval(this.terminalInterval);
    }
  }
}
