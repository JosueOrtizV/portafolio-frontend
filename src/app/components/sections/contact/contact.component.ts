import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly api = inject(ApiService);
  
  protected readonly profile = toSignal(this.api.getProfile(), { initialValue: null });
  
  protected readonly formData = signal({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  protected readonly isSubmitting = signal(false);
  protected readonly submitSuccess = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    this.submitError.set(null);
    
    try {
      await firstValueFrom(this.api.sendMessage(this.formData()));
      this.submitSuccess.set(true);
      this.formData.set({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);
    } catch (error) {
      this.submitError.set(this.i18n.language() === 'es' 
        ? 'Error al enviar el mensaje. Por favor, intenta de nuevo.' 
        : 'Error sending message. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
