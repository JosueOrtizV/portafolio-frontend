import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  public readonly i18n = inject(I18nService);
  public readonly api = inject(ApiService);

  public readonly profile = toSignal(this.api.getProfile(), { initialValue: null });

  getBioSentences(profileData: any): string[] {
    const bio = this.i18n.getText(profileData.biography, profileData.biography_en);
    if (!bio) return [];
    return bio
      .split(/\.(?=\s|$)/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s.endsWith('.') ? s : s + '.');
  }

  // Public signal for logs used in about.component.html
  public logs = signal<string[]>([
    '[08:00:00] INITIALIZING_ENVIRONMENT...',
    '[08:00:04] FRONTEND_MODULE_LOADED_OK',
    '[08:00:09] BACKEND_SYNERGY_SYNCED',
    '[08:00:15] MECHATRONIC_OVERLAY_ACTIVE'
  ]);

  private readonly incomingLogs = [
    '[09:12:44] UPDATING_SKILL_MATRIX...',
    '[09:15:22] CACHE_CLEARED_SYSTEM_STABLE',
    '[09:18:01] NEW_CONNECTION_DETECTED',
    '[09:20:55] RENDER_PIPELINE_COMPLETE'
  ];

  private logIndex = 0;
  private intervalId: any = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const nextLog = this.incomingLogs[this.logIndex % this.incomingLogs.length];
      this.logIndex++;

      this.logs.update(currentLogs => {
        const updated = [...currentLogs, nextLog];
        if (updated.length > 4) {
          updated.shift();
        }
        return updated;
      });
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
