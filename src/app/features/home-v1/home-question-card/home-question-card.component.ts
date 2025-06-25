import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRecentQuestion } from '../../../entity/userStatistics.interface';
import { ButtonLikeComponent } from "../../../components/button-like/button-like.component";

@Component({
  selector: 'home-question-card',
  imports: [CommonModule, ButtonLikeComponent],
  templateUrl: './home-question-card.component.html',
  styleUrl: './home-question-card.component.scss'
})
export class HomeQuestionCardComponent {
  question = input.required<IRecentQuestion>();

  date = computed(() => {
    const date = new Date(this.question().date);

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
