import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuestion } from '../../../entity/question.interface';
import { en_QuestionType } from '../../../entity/questionType.interface';
import { QuestionsService } from '../../../services/questions/questions.service';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { QuestionResponseService } from '../../../services/question-response/question-response.service';
import { ICreateQuestionResponse } from '../../../entity/questionResponse.interface';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { CongratulationsMessageComponent } from '../../../components/congratulations-message/congratulations-message.component';

@Component({
  selector: 'question-response',
  imports: [
    KhButtonComponent,
    RadioButtonModule,
    CheckboxModule,
    FormsModule,
    CommonModule,
    SkeletonModule,
    CongratulationsMessageComponent
  ],
  templateUrl: './question-response.component.html',
  styleUrl: './question-response.component.scss'
})
export class QuestionResponseComponent implements OnInit {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private questionService = inject(QuestionsService);
  private questionResponseService = inject(QuestionResponseService);
  private loggedUserService = inject(LoggedUserService)
  private dialogService = inject(DialogService);

  // Signals
  question = signal<IQuestion | null>(null);
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  selectedAlternativeIds = signal<string[]>([]);
  showConfetti = signal<boolean>(false);

  // Computed
  user = computed(() => this.loggedUserService.loggedUser());
  isMultipleChoice = computed(() => this.question()?.type_id === en_QuestionType.MULTIPLE_CHOICE);
  isTrueFalse = computed(() =>this.question()?.type_id === en_QuestionType.TRUE_FALSE);
  canSubmit = computed(() =>this.selectedAlternativeIds().length > 0 && !this.isSubmitted());

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
          this.dynamicDialogRef.close();
        }
      });
    } else if (data?.question) {
      this.question.set(data.question);
    }
  }

  submitResponse() {
    if (!this.canSubmit()) return;

    const formData : ICreateQuestionResponse = {
      question_id: this.question()?.id || '',
      user_id: this.user()?.id || '',
      alternative_ids: this.selectedAlternativeIds() || [],
    }

    this.questionResponseService.create(formData).subscribe({
      next: (response) => {
        console.log('Response submitted successfully:', response);
        this.isSubmitted.set(true);

        if(response.is_correct) {
          this.congratulations();
        }
        else{
          this.sadMessage();
        }
      },
      error: (error) => {
        console.error('Error submitting response:', error);
        this.isSubmitted.set(false);
      }
    });

    console.log('Submitting response...');
    console.log('Selected alternatives:', this.selectedAlternativeIds());

  }

  congratulations() {
    this.showConfetti.set(true);
    setTimeout(() => {
      this.showConfetti.set(false);
    }, 1500);
  }

  sadMessage(){

  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }
}
