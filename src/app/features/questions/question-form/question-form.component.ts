import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { QuestionTypesService } from '../../../services/question-types/question-types.service';
import { SelectModule } from 'primeng/select';
import { IQuestionType } from '../../../entity/quentionType.interface';
import { IQuestion } from '../../../entity/question.interface';
import { QuestionsService } from '../../../services/questions/questions.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Observable, firstValueFrom } from 'rxjs';
import {
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  FORM_CONSTANTS,
  AlternativeFormData
} from './question-form.types';

@Component({
  selector: 'question-form',
  imports: [InputTextModule, SelectModule, TextareaModule, FloatLabelModule, CheckboxModule, RadioButtonModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule, KhButtonComponent],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss'
})
export class QuestionFormComponent implements OnInit {
  // Injected services
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly questionTypesService = inject(QuestionTypesService);
  private readonly questionsService = inject(QuestionsService);
  private readonly loggedUserService = inject(LoggedUserService);
  private readonly notificationService = inject(NotificationService);

  // Reactive state
  readonly isSaving = signal<boolean>(false);
  readonly questionTypes = signal<IQuestionType[]>([]);
  readonly isEditMode = signal<boolean>(false);
  readonly isFormInitialized = signal<boolean>(false);
  readonly questionId = signal<string | null>(null);

  // Computed values
  readonly currentUser = computed(() => this.loggedUserService.loggedUser());
    // Form definition
  readonly formGroup = this.createFormGroup();

  async ngOnInit(): Promise<void> {
    await this.initializeComponent();
  }
  // Form creation method
  private createFormGroup(): FormGroup {
    return this.fb.group({
      id: [null as string | null],
      title: [null as string | null, Validators.required],
      statement: [null as string | null, Validators.required],
      type: [null as number | null, Validators.required],
      alternatives: this.fb.array([]),
      author_id: [this.currentUser().id as string],
      is_public: [false],
      created_at: [null as Date | null],
    });
  }

  private async initializeComponent() {
    // 1. Verificar se é modo de edição
    this.checkEditMode();

    // 2. Buscar tipos de questão
    await this.loadQuestionTypes();

    // 3. Inicializar formulário baseado no modo
    if (this.isEditMode()) {
      await this.initializeForEdit();
    } else {
      this.initializeForCreate();
    }

    this.isFormInitialized.set(true);
  }

  private checkEditMode(): void {
    const data = this.dialogConfig.data;
    if (data && data.question) {
      this.isEditMode.set(true);
      this.questionId.set(data.question);
    } else {
      this.isEditMode.set(false);
      this.questionId.set(null);
    }
  }

  private async loadQuestionTypes(): Promise<void> {
    try {
      const types = await firstValueFrom(this.questionTypesService.findAll());
      this.questionTypes.set(types as IQuestionType[]);
    } catch (error) {
      console.error('Error fetching question types:', error);
      this.notificationService.toastError(ERROR_MESSAGES.LOAD_QUESTION_TYPES);
      throw error;
    }
  }

  private initializeForCreate() {
    // Para criação, apenas inicializar com 2 alternativas vazias
    this.initializeEmptyAlternatives();
  }

  private async initializeForEdit(): Promise<void> {
    const questionId = this.questionId();
    if (questionId != null) {
      await this.loadQuestionById(questionId);
    }
    else {
      this.notificationService.toastError(ERROR_MESSAGES.LOAD_QUESTION);
      this.dialogRef.close();
    }
  }

  private async loadQuestionById(id: string): Promise<void> {
    try {
      const question = await firstValueFrom(this.questionsService.findOne(String(id)) as Observable<IQuestion>);
      this.populateFormWithQuestion(question);
    }
    catch (error) {
      console.error('Error loading question:', error);
      this.notificationService.toastError(ERROR_MESSAGES.LOAD_QUESTION);
    }
  }  private populateFormWithQuestion(question: IQuestion): void {
    // Preencher o formulário com os dados da questão
    this.formGroup.patchValue({
      id: question.id || null,
      title: question.title || null,
      statement: question.statement || null,
      type: question.type_id,
      author_id: question.author_id || this.currentUser().id,
      is_public: question.is_public || false,
      created_at: question.created_at || null
    });

    // Preencher alternativas
    this.populateAlternatives(question.alternatives || []);
  }

  private populateAlternatives(alternatives: any[]): void {
    // Limpar alternativas existentes
    this.alternatives.clear();

    if (alternatives && alternatives.length > 0) {
      alternatives.forEach(alt => {
        const alternativeGroup = this.createAlternativeFormGroup(alt);
        this.alternatives.push(alternativeGroup);
      });
    } else {
      // Se não há alternativas, inicializar com alternativas vazias
      this.initializeEmptyAlternatives();
    }
  }
  private createAlternativeFormGroup(alternative?: Partial<AlternativeFormData>): FormGroup {
    return this.fb.group({
      id: [alternative?.id || null],
      text: [alternative?.text || '', Validators.required],
      is_correct: [alternative?.is_correct || false]
    });
  }

  private initializeEmptyAlternatives(): void {
    this.alternatives.clear();
    for (let i = 0; i < FORM_CONSTANTS.DEFAULT_ALTERNATIVES_COUNT; i++) {
      this.handleAddAlternative();
    }
  }

  // Getter para facilitar o acesso ao FormArray de alternativas
  get alternatives(): FormArray {
    return this.formGroup.get('alternatives') as FormArray;
  }

  handleAddAlternative(): void {
    const newAlternative = this.createAlternativeFormGroup();
    this.alternatives.push(newAlternative);
  }

  handleRemoveAlternative(index: number): void {
    if (this.alternatives.length <= 1) {
      this.notificationService.toastError(VALIDATION_MESSAGES.MIN_ALTERNATIVE_ERROR);
      return;
    }
    this.alternatives.removeAt(index);
  }  handleSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSaving.set(true);
    const formData = this.prepareFormData();

    if (this.isEditMode()) {
      this.updateQuestion(formData);
    }
    else {
      this.createQuestion(formData);
    }
  }

  private isFormValid(): boolean {
    // Verificar validações básicas do formulário
    if (this.formGroup.invalid) {
      this.markFormGroupTouched();
      this.showValidationErrors();
      return false;
    }

    // Validar alternativas específicamente
    return this.validateAlternatives();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showValidationErrors(): void {
    const { title, statement, type } = this.formGroup.value;

    if (!title) {
      this.notificationService.toastError(VALIDATION_MESSAGES.TITLE_REQUIRED);
      return;
    }

    if (!statement) {
      this.notificationService.toastError(VALIDATION_MESSAGES.STATEMENT_REQUIRED);
      return;
    }

    if (!type) {
      this.notificationService.toastError(VALIDATION_MESSAGES.TYPE_REQUIRED);
      return;
    }
  }

  private validateAlternatives(): boolean {
    const alternatives = this.alternatives.value;
    const validAlternatives = alternatives.filter((alt: any) => alt.text && alt.text.trim() !== '');

    if (validAlternatives.length < FORM_CONSTANTS.MIN_ALTERNATIVES_COUNT) {
      this.notificationService.toastError(VALIDATION_MESSAGES.MIN_ALTERNATIVES);
      return false;
    }

    const correctAlternatives = validAlternatives.filter((alt: any) => alt.is_correct);
    if (correctAlternatives.length === 0) {
      this.notificationService.toastError(VALIDATION_MESSAGES.CORRECT_ALTERNATIVE_REQUIRED);
      return false;
    }

    return true;
  }
  private prepareFormData(): IQuestion {
    const form = this.formGroup.getRawValue();

    // Filtrar apenas alternativas válidas (com texto)
    form.alternatives = form.alternatives.filter((alt: any) => alt.text && alt.text.trim() !== '');

    // Remover campos nulos/undefined apenas se for criação
    if (!this.isEditMode()) {
      const cleanedForm = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== null && value !== undefined)
      );
      return cleanedForm as unknown as IQuestion;
    }

    return form as unknown as IQuestion;
  }

  private createQuestion(questionData: IQuestion): void {

    this.questionsService.createWithAlternatives(questionData).subscribe({
      next: (question: any) => {
        this.notificationService.toastSuccess(SUCCESS_MESSAGES.QUESTION_CREATED);
        this.dialogRef.close(questionData);
      },
      error: (error: any) => {
        console.error('Error creating question:', error);
        this.notificationService.toastError(ERROR_MESSAGES.CREATE_QUESTION);
      },
      complete: () => {
        this.isSaving.set(false);
      }
    });
  }

  private updateQuestion(questionData: IQuestion): void {

    if (!questionData.id) {
      console.error('Cannot update question without ID');
      this.isSaving.set(false);
      this.notificationService.toastError(ERROR_MESSAGES.MISSING_ID);
      return;
    }

    this.questionsService.update(String(questionData.id), questionData).subscribe({
      next: (question: any) => {
        this.notificationService.toastSuccess(SUCCESS_MESSAGES.QUESTION_UPDATED);
        this.dialogRef.close(questionData);
      },
      error: (error: any) => {
        console.error('Error updating question:', error);
        this.notificationService.toastError(ERROR_MESSAGES.UPDATE_QUESTION);
      },
      complete: () => {
        this.isSaving.set(false);
      }
    });
  }

  handleCancel(): void {
    this.dialogRef.close();
  }
}
