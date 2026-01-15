import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Skill } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);
  
  protected readonly skills = toSignal(this.api.getSkills(), { initialValue: [] as Skill[] });

  protected getSkillsByType(type: 'soft' | 'hard' | null): Skill[] {
    return this.skills().filter(skill => skill.skill_type === type && skill.is_active);
  }

  protected getTechnicalSkills(): Skill[] {
    return this.skills().filter(skill => !skill.skill_type && skill.is_active);
  }

  protected getSkillsByCategory(category: string): Skill[] {
    return this.skills().filter(skill => skill.category === category && skill.is_active);
  }
}
