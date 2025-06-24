import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuestion } from '../../../entity/question.interface';
import { IAlternative } from '../../../entity/alternative.interface';
import { IQuestionResponse, IQuestionResponseResult } from '../../../entity/questionResponse.interface';
import { en_QuestionType } from '../../../entity/questionType.interface';
import { QuestionsService } from '../../../services/questions/questions.service';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'question-response',
  imports: [
    KhButtonComponent,
    RadioButtonModule,
    CheckboxModule,
    FormsModule,
    CommonModule,
    SkeletonModule
  ],
  templateUrl: './question-response.component.html',
  styleUrl: './question-response.component.scss'
})
export class QuestionResponseComponent implements OnInit {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private questionService = inject(QuestionsService);

  // Signals
  question = signal<IQuestion | null>(null);
  selectedAlternatives = signal<string[]>([]);
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  responseResult = signal<IQuestionResponseResult | null>(null);

  // Computed
  isMultipleChoice = computed(() =>
    this.question()?.type_id === en_QuestionType.MULTIPLE_CHOICE
  );

  isTrueFalse = computed(() =>
    this.question()?.type_id === en_QuestionType.TRUE_FALSE
  );

  canSubmit = computed(() =>
    this.selectedAlternatives().length > 0 && !this.isSubmitted()
  );

  ngOnInit() {
    this.loadQuestion();
  }
  private loadQuestion() {
    const data = this.dynamicDialogConfig.data;
    if (data?.questionId) {
      this.isLoading.set(true);
      this.questionService.findOne(data.questionId).subscribe({
        next: (question: any) => {
          this.question.set(question as IQuestion);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading question:', error);
          this.isLoading.set(false);
        }
      });
    } else if (data?.question) {
      this.question.set(data.question);
    }
  }

  onAlternativeChange(alternativeId: string, checked?: boolean) {
    const currentSelected = this.selectedAlternatives();

    if (this.isMultipleChoice()) {
      // Para múltipla escolha, permite múltiplas seleções
      if (checked) {
        this.selectedAlternatives.set([...currentSelected, alternativeId]);
      } else {
        this.selectedAlternatives.set(currentSelected.filter(id => id !== alternativeId));
      }
    } else {
      // Para V/F, permite apenas uma seleção
      this.selectedAlternatives.set([alternativeId]);
    }
  }

  isAlternativeSelected(alternativeId: string): boolean {
    return this.selectedAlternatives().includes(alternativeId);
  }

  submitResponse() {
    if (!this.canSubmit()) return;

    const question = this.question();
    if (!question || !question.alternatives) return;

    const correctAlternatives = question.alternatives
      .filter(alt => alt.is_correct)
      .map(alt => alt.id!);

    const userAlternatives = this.selectedAlternatives();

    // Verifica se a resposta está correta
    const isCorrect = this.checkAnswer(correctAlternatives, userAlternatives);

    const result: IQuestionResponseResult = {
      isCorrect,
      correctAlternatives,
      userAlternatives
    };

    this.responseResult.set(result);
    this.isSubmitted.set(true);
  }

  private checkAnswer(correct: string[], user: string[]): boolean {
    if (correct.length !== user.length) return false;
    return correct.every(id => user.includes(id));
  }

  tryAgain() {
    this.selectedAlternatives.set([]);
    this.isSubmitted.set(false);
    this.responseResult.set(null);
  }

  close() {
    this.dynamicDialogRef.close();
  }

  getAlternativeClass(alternative: IAlternative): string {
    if (!this.isSubmitted()) return '';

    const result = this.responseResult();
    if (!result) return '';

    const alternativeId = alternative.id!;
    const isCorrect = alternative.is_correct;
    const wasSelected = result.userAlternatives.includes(alternativeId);

    if (isCorrect) {
      return 'correct-alternative';
    } else if (wasSelected && !isCorrect) {
      return 'incorrect-alternative';
    }

    return '';
  }
}
