import { Injectable, signal, computed } from '@angular/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly currentLanguage = signal<Language>('es');
  
  readonly language = this.currentLanguage.asReadonly();
  
  readonly isSpanish = computed(() => this.currentLanguage() === 'es');
  readonly isEnglish = computed(() => this.currentLanguage() === 'en');

  constructor() {
    // Cargar idioma guardado en localStorage o usar el del navegador
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      this.currentLanguage.set(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      this.currentLanguage.set(browserLang === 'es' ? 'es' : 'en');
    }
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  /**
   * Obtiene el texto según el idioma actual
   * @param textEs Texto en español
   * @param textEn Texto en inglés
   * @returns El texto correspondiente al idioma actual
   */
  getText(textEs: string | null | undefined, textEn: string | null | undefined): string {
    const lang = this.currentLanguage();
    if (lang === 'es') {
      return textEs || textEn || '';
    }
    return textEn || textEs || '';
  }

  /**
   * Obtiene el texto según el idioma actual (computed signal)
   */
  getTextSignal(textEs: string | null | undefined, textEn: string | null | undefined) {
    return computed(() => this.getText(textEs, textEn));
  }

  /**
   * Traducciones de secciones
   */
  readonly sections = {
    about: computed(() => this.currentLanguage() === 'es' ? 'Acerca de' : 'About'),
    skills: computed(() => this.currentLanguage() === 'es' ? 'Habilidades' : 'Skills'),
    projects: computed(() => this.currentLanguage() === 'es' ? 'Proyectos' : 'Projects'),
    experience: computed(() => this.currentLanguage() === 'es' ? 'Experiencia' : 'Experience'),
    education: computed(() => this.currentLanguage() === 'es' ? 'Educación' : 'Education'),
    certifications: computed(() => this.currentLanguage() === 'es' ? 'Certificaciones' : 'Certifications'),
    contact: computed(() => this.currentLanguage() === 'es' ? 'Contacto' : 'Contact'),
    downloadCv: computed(() => this.currentLanguage() === 'es' ? 'Descargar CV' : 'Download CV'),
    contactMe: computed(() => this.currentLanguage() === 'es' ? 'Contactar' : 'Contact Me'),
  };
}
