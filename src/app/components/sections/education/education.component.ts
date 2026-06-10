import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Education } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);
  
  protected readonly educations = toSignal(this.api.getEducations(), { initialValue: [] as Education[] });

  protected formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = this.i18n.language() === 'es' 
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  protected getCardClasses(index: number): string {
    // Alternates between magenta and purple shadows for visual interest
    return index % 2 === 0 
      ? 'voxel-shadow-magenta hover:shadow-[8px_8px_0px_0px_rgba(254,0,254,1)]' 
      : 'voxel-shadow-purple hover:shadow-[12px_12px_0px_0px_rgba(149,0,223,1)]';
  }
}
