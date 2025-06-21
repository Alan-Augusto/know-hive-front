import { Component, inject, model, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IQuestion } from '../../../entity/question.interface';
import { NotificationService } from '../../../services/notification/notification.service';
import { QuestionsService } from '../../../services/questions/questions.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';

@Component({
  selector: 'question-select-list',
  imports: [InputTextModule, TextareaModule, CheckboxModule, FloatLabelModule, RadioButtonModule, FormsModule, ReactiveFormsModule, CommonModule, KhButtonComponent],
  templateUrl: './question-select-list.component.html',
  styleUrl: './question-select-list.component.scss'
})
export class QuestionSelectListComponent {

  private readonly notificationService = inject(NotificationService);
  private readonly questionService = inject(QuestionsService);


  questionsList = signal<IQuestion[]>([]);
  questionsListBackup = signal<IQuestion[]>([]);
  selectedQuestions = model<string[]>([]);

  ngOnInit(): void {
    this.loadQuestions();
  }


  private async loadQuestions(): Promise<void> {
    try {
      const questions = await firstValueFrom(this.questionService.findAll() as Observable<IQuestion[]>);

      this.questionsList.set(questions);
      this.questionsListBackup.set(questions);

    } catch (error) {
      this.notificationService.toastError('Erro ao carregar perguntas.');
      console.error(error);
    }
  }

  handleSearchQuestion(event: any): void {
    const therm = event?.target?.value as string;
    if (!therm) {
      this.questionsList.set(this.questionsListBackup());
      return;
    }

    const filteredQuestions = this.questionsListBackup().filter(question =>
      question.title.toLowerCase().includes(therm.toLowerCase()) ||
      (question.statement?.toLowerCase().includes(therm.toLowerCase()))
    );

    this.questionsList.set(filteredQuestions);
  }

}
