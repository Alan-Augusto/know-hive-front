import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
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
import { CheckboxModule } from 'primeng/checkbox';

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


  isSaving = signal<boolean>(false);
  questionsTypes = signal<IQuestionType[]>([]);
  user = computed(() => this.loggedUserService.loggedUser());

  formGroup = this.fb.group({
    id: [null, []],
    title: [null, []],
    statement: [null, []],
    type: [null, []],
    alternatives: this.fb.array([], []), // Array de FormGroups de alternativa
    author_id: [this.user().id, []],
    created_at: [null, []],
  });
  ngOnInit() {
    this.findTypes();
    this.initializeAlternatives();
  }

  // Inicializa o formulário com 2 alternativas vazias
  initializeAlternatives() {
    this.handleAddAlternative();
    this.handleAddAlternative();
  }

  // Getter para facilitar o acesso ao FormArray de alternativas
  get alternatives(): FormArray {
    return this.formGroup.get('alternatives') as FormArray;
  }

  findTypes() {
    this.questionTypesService.findAll().subscribe({
      next: (types) => {
        this.questionsTypes.set(types as IQuestionType[]);
      },
      error: (err) => {
        console.error('Error fetching question types:', err);
      },
      complete: () => { }
    })

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
  }
  handleSave() {
    // Validação básica
    if (!this.formGroup.value.title) {
      this.notificationService.toastError('Título é obrigatório.');
      return;
    }

    if (!this.formGroup.value.statement) {
      this.notificationService.toastError('Descrição é obrigatória.');
      return;
    }

    if (!this.formGroup.value.type) {
      this.notificationService.toastError('Tipo de questão é obrigatório.');
      return;
    }

    // Validar alternativas
    const alternatives = this.alternatives.value;
    const validAlternatives = alternatives.filter((alt: any) => alt.text && alt.text.trim() !== '');

    if (validAlternatives.length < 2) {
      this.notificationService.toastError('É necessário ter pelo menos 2 alternativas válidas.');
      return;
    }

    const correctAlternatives = validAlternatives.filter((alt: any) => alt.is_correct);
    if (correctAlternatives.length === 0) {
      this.notificationService.toastError('É necessário marcar pelo menos uma alternativa como correta.');
      return;
    }

    this.isSaving.set(true);

    let form = this.formGroup.getRawValue();

    // Filtrar apenas alternativas válidas (com texto)
    form.alternatives = form.alternatives.filter((alt: any) => alt.text && alt.text.trim() !== '');

    const questionData = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value !== null && value !== undefined)
    ) as unknown as IQuestion;

    this.questionService.create(questionData).subscribe({
      next: (question: any) => {
      },
      error: (err) => {
        console.error('Error saving question:', err);
        this.isSaving.set(false);
        this.notificationService.toastError('Erro ao salvar questão.');
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
