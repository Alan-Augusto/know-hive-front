import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRecentQuestion } from '../../../entity/userStatistics.interface';

@Component({
  selector: 'home-question-card',
  imports: [CommonModule],
  templateUrl: './home-question-card.component.html',
  styleUrl: './home-question-card.component.scss'
})
export class HomeQuestionCardComponent {
  question = input.required<IRecentQuestion>();
}
