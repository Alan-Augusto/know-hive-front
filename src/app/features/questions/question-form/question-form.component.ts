import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'question-form',
  imports: [InputTextModule, SelectModule, TextareaModule, FloatLabelModule, CheckboxModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule, KhButtonComponent],
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
  private dynamicDialogConfig = inject(DynamicDialogConfig);

  isSaving = signal<boolean>(false);
  questionsTypes = signal<IQuestionType[]>([]);
  isEditMode = signal<boolean>(false);
  isFormInitialized = signal<boolean>(false);
  questionId = signal<string|null>(null);
  user = computed(() => this.loggedUserService.loggedUser());
  formGroup = this.fb.group({
    id: [null as string | null],
    title: [null as string | null],
    statement: [null as string | null],
    type: [null as number | null],
    alternatives: this.fb.array([]), // Array de FormGroups de alternativa
    author_id: [this.user().id as string],
    created_at: [null as Date | null],
  });

  async ngOnInit() {
    await this.initializeComponent();
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
  private checkEditMode() {
    const data = this.dynamicDialogConfig.data;
    if (data && data.question) {
      console.log('Edit mode detected - received question data:', data.question);
      this.isEditMode.set(true);
      this.questionId.set(data.question);
    } else {
      console.log('Create mode - no question data received');
      this.isEditMode.set(false);
      this.questionId.set(null);
    }
  }

  private async loadQuestionTypes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.questionTypesService.findAll().subscribe({
        next: (types) => {
          this.questionsTypes.set(types as IQuestionType[]);
          resolve();
        },
        error: (err) => {
          console.error('Error fetching question types:', err);
          reject(err);
        }
      });
    });
  }

  private initializeForCreate() {
    console.log('Initializing form for create mode');
    // Para criação, apenas inicializar com 2 alternativas vazias
    this.initializeEmptyAlternatives();
  }

  private async initializeForEdit() {
    if (this.questionId()!=null) {
      await this.loadQuestionById(this.questionId()!);
    }
    else {
      this.notificationService.toastError('Erro ao carregar a questão.');
      this.dynamicDialogRef.close();
      return;
    }
  } private async loadQuestionById(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      (this.questionService.findOne(String(id)) as Observable<IQuestion>).subscribe({
        next: (question: IQuestion) => {
          console.log('Fetched question from server:', question);
          this.populateFormWithQuestion(question);
          resolve();
        },
        error: (err: any) => {
          this.notificationService.toastError('Erro ao carregar a questão.');
          resolve(); // Não rejeitar para não quebrar o fluxo
        }
      });
    });
  }

  private populateFormWithQuestion(question: IQuestion) {
    // Preencher o formulário com os dados da questão
    this.formGroup.patchValue({
      id: question.id || null,
      title: question.title || null,
      statement: question.statement || null,
      type: question.type_id,
      author_id: question.author_id || this.user().id,
      created_at: question.created_at || null
    });

    // Preencher alternativas
    this.populateAlternatives(question.alternatives || []);
  }

  private populateAlternatives(alternatives: any[]) {
    // Limpar alternativas existentes
    this.alternatives.clear();

    if (alternatives && alternatives.length > 0) {
      alternatives.forEach(alt => {
        const alternativeGroup = this.fb.group({
          id: [alt.id || null],
          text: [alt.text || ''],
          is_correct: [alt.is_correct || false]
        });
        this.alternatives.push(alternativeGroup);
      });
    } else {
      // Se não há alternativas, inicializar com 2 vazias
      this.initializeEmptyAlternatives();
    }
  }

  // Inicializa o formulário com 2 alternativas vazias
  private initializeEmptyAlternatives() {
    this.alternatives.clear();
    this.handleAddAlternative();
    this.handleAddAlternative();
  }

  // Getter para facilitar o acesso ao FormArray de alternativas
  get alternatives(): FormArray {
    return this.formGroup.get('alternatives') as FormArray;
  }

  handleAddAlternative() {
    // Criar uma nova alternativa vazia diretamente no FormArray
    const newAlternative = this.fb.group({
      id: [null],
      text: [''],
      is_correct: [false]
    });

    this.alternatives.push(newAlternative);
  }
  // Método para remover uma alternativa do array
  handleRemoveAlternative(index: number) {
    if (this.alternatives.length <= 1) {
      this.notificationService.toastError('É necessário ter pelo menos uma alternativa.');
      return;
    }
    this.alternatives.removeAt(index);
  } handleSave() {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving.set(true);

    const formData = this.prepareFormData();
    console.log('Prepared form data:', formData);

    if (this.isEditMode()) {
      this.updateQuestion(formData);
    } else {
      this.createQuestion(formData);
    }
  }

  private validateForm(): boolean {
    // Validação básica
    if (!this.formGroup.value.title) {
      this.notificationService.toastError('Título é obrigatório.');
      return false;
    }

    if (!this.formGroup.value.statement) {
      this.notificationService.toastError('Descrição é obrigatória.');
      return false;
    }

    if (!this.formGroup.value.type) {
      this.notificationService.toastError('Tipo de questão é obrigatório.');
      return false;
    }

    // Validar alternativas
    const alternatives = this.alternatives.value;
    const validAlternatives = alternatives.filter((alt: any) => alt.text && alt.text.trim() !== '');

    if (validAlternatives.length < 2) {
      this.notificationService.toastError('É necessário ter pelo menos 2 alternativas válidas.');
      return false;
    }

    const correctAlternatives = validAlternatives.filter((alt: any) => alt.is_correct);
    if (correctAlternatives.length === 0) {
      this.notificationService.toastError('É necessário marcar pelo menos uma alternativa como correta.');
      return false;
    }

    return true;
  }

  private prepareFormData(): IQuestion {
    let form = this.formGroup.getRawValue();

    // Filtrar apenas alternativas válidas (com texto)
    form.alternatives = form.alternatives.filter((alt: any) => alt.text && alt.text.trim() !== '');

    // Remover campos nulos/undefined apenas se for criação
    if (!this.isEditMode()) {
      const cleanedForm = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => value !== null && value !== undefined)
      );
      return cleanedForm as unknown as IQuestion;
    }

    return form as unknown as IQuestion;
  }

  private createQuestion(questionData: IQuestion) {
    console.log('Creating new question:', questionData);

    this.questionService.createWithAlternatives(questionData).subscribe({
      next: (question: any) => {
        console.log('Question created successfully:', question);
      },
      error: (err) => {
        console.error('Error creating question:', err);
        this.isSaving.set(false);
        this.notificationService.toastError('Erro ao criar questão.');
      },
      complete: () => {
        this.isSaving.set(false);
        this.notificationService.toastSuccess('Questão criada com sucesso!');
        this.dynamicDialogRef.close(questionData);
      }
    });
  }

  private updateQuestion(questionData: IQuestion) {
    console.log('Updating existing question:', questionData);

    if (!questionData.id) {
      console.error('Cannot update question without ID');
      this.isSaving.set(false);
      this.notificationService.toastError('Erro: ID da questão não encontrado.');
      return;
    }

    // Para atualização, você pode usar o método update do serviço
    this.questionService.update(String(questionData.id), questionData).subscribe({
      next: (question: any) => {
        console.log('Question updated successfully:', question);
      },
      error: (err) => {
        console.error('Error updating question:', err);
        this.isSaving.set(false);
        this.notificationService.toastError('Erro ao atualizar questão.');
      },
      complete: () => {
        this.isSaving.set(false);
        this.notificationService.toastSuccess('Questão atualizada com sucesso!');
        this.dynamicDialogRef.close(questionData);
      }
    });
  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }
}
