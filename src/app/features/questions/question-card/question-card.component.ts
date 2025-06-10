import { Component, input } from '@angular/core';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { IQuestion } from '../../../entity/question.interface';

@Component({
  selector: 'question-card',
  imports: [KhButtonComponent, DatePipe, TooltipModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent {
  item = input.required<IQuestion>();
}
