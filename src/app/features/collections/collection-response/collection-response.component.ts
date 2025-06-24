import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICollection } from '../../../entity/collection.interface';
import { IQuestion } from '../../../entity/question.interface';
import { en_QuestionType } from '../../../entity/questionType.interface';
import { CollectionsService } from '../../../services/collections/collections.service';
import { QuestionResponseService } from '../../../services/question-response/question-response.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CongratulationsMessageComponent } from '../../../components/congratulations-message/congratulations-message.component';
import { ICreateQuestionResponse } from '../../../entity/questionResponse.interface';

@Component({
  selector: 'collection-response',
  imports: [
    KhButtonComponent,
    RadioButtonModule,
    CheckboxModule,
    FormsModule,
    CommonModule,
    SkeletonModule,
    CongratulationsMessageComponent
  ],
  templateUrl: './collection-response.component.html',
  styleUrl: './collection-response.component.scss'
})
export class CollectionResponseComponent implements OnInit {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private collectionsService = inject(CollectionsService);
  private questionResponseService = inject(QuestionResponseService);
  private loggedUserService = inject(LoggedUserService)
  private dialogService = inject(DialogService);

  // Signals
  collection = signal<ICollection | null>(null);
  questions = signal<IQuestion[]>([]);
  currentQuestionIndex = signal<number>(0);
  isLoading = signal<boolean>(false);
  isSubmiting = signal<boolean>(false);
  selectedAlternativeIds = signal<string[]>([]);
  showConfetti = signal<boolean>(false);
  questionsCompleted = signal<number>(0);
  correctAnswers = signal<number>(0);

  // Computed
  user = computed(() => this.loggedUserService.loggedUser());
  currentQuestion = computed(() => {
    const questions = this.questions();
    const index = this.currentQuestionIndex();
    return questions.length > 0 && index < questions.length ? questions[index] : null;
  });
  isMultipleChoice = computed(() => this.currentQuestion()?.type_id === en_QuestionType.MULTIPLE_CHOICE);
  isTrueFalse = computed(() => this.currentQuestion()?.type_id === en_QuestionType.TRUE_FALSE);
  canSubmit = computed(() => this.selectedAlternativeIds().length > 0);
  hasMoreQuestions = computed(() => this.currentQuestionIndex() < this.questions().length - 1);
  isComplete = computed(() => this.questionsCompleted() === this.questions().length);  progressPercentage = computed(() => {
    const total = this.questions().length;
    return total > 0 ? Math.round((this.questionsCompleted() / total) * 100) : 0;
  });
  accuracyPercentage = computed(() => {
    const total = this.questions().length;
    return total > 0 ? Math.round((this.correctAnswers() / total) * 100) : 0;
  });

  ngOnInit() {
    this.loadCollection();
  }

  private loadCollection() {
    console.log('Loading collection...');
    const data = this.dynamicDialogConfig.data;
    console.log('Dynamic dialog data:', data);
    if (data?.collectionId) {
      this.isLoading.set(true);
      this.collectionsService.findOne(data.collectionId).subscribe({
        next: (collection: any) => {
          console.log('Collection loaded:', collection);
          this.collection.set(collection as ICollection);
          this.questions.set(collection.questions || []);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading collection:', error);
          this.isLoading.set(false);
          this.dynamicDialogRef.close();
        }
      });
    } else if (data?.collection) {
      this.collection.set(data.collection);
      this.questions.set(data.collection.questions || []);
    }
  }

  submitResponse() {
    if (!this.canSubmit() || !this.currentQuestion()) return;

    const formData: ICreateQuestionResponse = {
      question_id: this.currentQuestion()?.id || '',
      user_id: this.user()?.id || '',
      alternative_ids: this.selectedAlternativeIds() || [],
    }

    this.isSubmiting.set(true);
    this.questionResponseService.create(formData).subscribe({
      next: (response) => {

        console.log('Response submitted successfully:', response);

        if (response.is_correct) {
          this.correctAnswers.update(count => count + 1);
        }

        this.questionsCompleted.update(count => count + 1);
        this.selectedAlternativeIds.set([]);

        if (this.hasMoreQuestions()) {
          this.nextQuestion();
        } else {
          this.showResults();
        }
        this.isSubmiting.set(false);
      },
      error: (error) => {
        this.isSubmiting.set(false);
        console.error('Error submitting response:', error);
      }
    });
  }

  nextQuestion() {
    this.currentQuestionIndex.update(index => index + 1);
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(index => index - 1);
    }
  }

  showResults() {
    this.showConfetti.set(true);
    setTimeout(() => {
      this.showConfetti.set(false);
    }, 3000);
  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }

  handleFinish() {
    this.dynamicDialogRef.close({
      completed: true,
      totalQuestions: this.questions().length,
      correctAnswers: this.correctAnswers()
    });
  }
}
