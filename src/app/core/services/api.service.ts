import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import {
  Project,
  Skill,
  Profile,
  Experience,
  Education,
  Certification,
  Message,
  PortfolioData
} from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.josueortiz.dev/api';

  // Global Unified Cache
  private portfolioCache$?: Observable<PortfolioData>;

  /**
   * Obtiene todos los datos del portafolio en una sola petición.
   */
  getPortfolioData(): Observable<PortfolioData> {
    if (!this.portfolioCache$) {
      this.portfolioCache$ = this.http.get<PortfolioData>(`${this.apiUrl}/portfolio`).pipe(
        shareReplay(1)
      );
    }
    return this.portfolioCache$;
  }

  // Projects
  getProjects(): Observable<Project[]> {
    return this.getPortfolioData().pipe(map(data => data.projects));
  }

  getProjectBySlug(slug: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${slug}`);
  }

  // Profile
  getProfile(): Observable<Profile> {
    return this.getPortfolioData().pipe(map(data => data.profile));
  }

  // Skills
  getSkills(): Observable<Skill[]> {
    return this.getPortfolioData().pipe(map(data => data.skills));
  }

  // Experiences
  getExperiences(): Observable<Experience[]> {
    return this.getPortfolioData().pipe(map(data => data.experiences));
  }

  // Educations
  getEducations(): Observable<Education[]> {
    return this.getPortfolioData().pipe(map(data => data.educations));
  }

  // Certifications
  getCertifications(): Observable<Certification[]> {
    return this.getPortfolioData().pipe(map(data => data.certifications));
  }

  // Messages (no cacheado)
  sendMessage(message: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, message);
  }

  // Health check
  healthCheck(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/health`);
  }
}
