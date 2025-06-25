import { Component, computed, input, signal } from '@angular/core';
import { IRecentCollection } from '../../../entity/userStatistics.interface';
import { ButtonLikeComponent } from '../../../components/button-like/button-like.component';

@Component({
  selector: 'home-collection-card',
  imports: [ButtonLikeComponent],
  templateUrl: './home-collection-card.component.html',
  styleUrl: './home-collection-card.component.scss'
})
export class HomeCollectionCardComponent {
  collection = input.required<IRecentCollection>();

  listIcons = signal<string[]>([
    'ti ti-notebook',
    'ti ti-pencil',
    'ti ti-clipboard',
    'ti ti-file-text',
    'ti ti-file-alert',
    'ti ti-file-analytics',
    'ti ti-file-code',
    'ti ti-file-smile',
    'ti ti-file-zip',
    'ti ti-file',
  ])

  icon = computed(() => {
    const index = Math.floor(Math.random() * this.listIcons().length);
    return this.listIcons()[index];
  });

  date = computed(() => {
    const date = new Date(this.collection().date);

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `há ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
      }
      return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    } else {
      const diffWeeks = Math.floor(diffDays / 7);
      return `há ${diffWeeks} semana${diffWeeks !== 1 ? 's' : ''}`;
    }
  });

  likeQuestion(id: string) {
  }
}
