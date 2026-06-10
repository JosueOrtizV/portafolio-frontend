import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Experience } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);

  protected readonly experiences = toSignal(this.api.getExperiences(), { initialValue: [] as Experience[] });

  protected formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = this.i18n.language() === 'es'
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  protected getIndexLabel(index: number): string {
    return (index + 1).toString().padStart(2, '0');
  }

  protected getCardClasses(index: number): string {
    return index === 0 
      ? 'border-primary voxel-shadow-magenta hover:shadow-[8px_8px_0px_0px_rgba(254,0,254,1)]' 
      : 'border-primary shadow-[4px_4px_0px_0px_rgba(149,0,223,1)] hover:shadow-[8px_8px_0px_0px_rgba(149,0,223,1)]';
  }
}
