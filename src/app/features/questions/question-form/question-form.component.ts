import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthBaseComponent } from '../../../components/auth-base/auth-base.component';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { QuestionTypesService } from '../../../services/question-types/question-types.service';
import { SelectModule } from 'primeng/select';
import { IQuestionType } from '../../../entity/quentionType.interface';
import { IQuestion } from '../../../entity/question.interface';
import { QuestionsService } from '../../../services/questions/questions.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'question-form',
  imports: [InputTextModule, SelectModule, TextareaModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule, AuthBaseComponent, KhButtonComponent],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss'
})
export class QuestionFormComponent {

  private fb = inject(FormBuilder);
  private dynamicDialogRef = inject(DynamicDialogRef);
  private questionTypesService = inject(QuestionTypesService)
  private questionService = inject(QuestionsService);
  private loggedUserService = inject(LoggedUserService);
  private notificationService = inject(NotificationService);



  isSaving = signal<boolean>(false);
  questionsTypes = signal<IQuestionType[]>([]);
  user = computed(() => this.loggedUserService.loggedUser());

  formGroup = this.fb.group({
    id: [null, []],
    statement: [null, []],
    type: [null, []],
    author_id: [this.user().id, []], // This should be set to the logged-in user ID
    created_at: [null, []],
  });

  ngOnInit() {
    this.findTypes();
  }

  findTypes() {
    this.questionTypesService.findAll().subscribe({
      next: (types) => {
        console.log('Fetched question types:', types);
        this.questionsTypes.set(types as IQuestionType[]);
      },
      error: (err) => {
        console.error('Error fetching question types:', err);
      },
      complete: () => {}
    })

  }

  handleSave() {
    let form = this.formGroup.getRawValue();

    const questionData = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value !== null && value !== undefined)
    ) as unknown as IQuestion;

    this.questionService.create(questionData).subscribe({
      next: (question:any) => {
      },
      error: (err) => {
        console.error('Error saving question:', err);
      },
      complete: () => {
        this.isSaving.set(false);
        this.notificationService.toastSuccess('Questão criada com sucesso!');
        this.dynamicDialogRef.close(questionData);
      }
  });

  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }
}
