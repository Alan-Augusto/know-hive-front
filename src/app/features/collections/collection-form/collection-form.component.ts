import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { ICollection } from '../../../entity/collection.interface';
import { CollectionsService } from '../../../services/collections/collections.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { FormService } from '../../../services/utils/form.service';
import { firstValueFrom, Observable } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';

import { QuestionSelectListComponent } from "../question-select-list/question-select-list.component";

@Component({
  selector: 'collection-form',
  imports: [InputTextModule, AccordionModule, TextareaModule, CheckboxModule, FloatLabelModule, RadioButtonModule, FormsModule, ReactiveFormsModule, CommonModule, KhButtonComponent, QuestionSelectListComponent],
  templateUrl: './collection-form.component.html',
  styleUrl: './collection-form.component.scss'
})
export class CollectionFormComponent implements OnInit {
  // Injected services
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly collectionsService = inject(CollectionsService);
  private readonly loggedUserService = inject(LoggedUserService);
  private readonly notificationService = inject(NotificationService);
  private readonly formService = inject(FormService);
  // Reactive state
  readonly isSaving = signal<boolean>(false);
  readonly isEditMode = signal<boolean>(false);
  readonly collectionId = signal<string | null>(null);
  selectedQuestions = signal<string[]>([]);

  // Computed properties
  readonly user = computed(() => this.loggedUserService.loggedUser());

  // Form group
  collectionForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.handleDialogData();
  }

  private initializeForm(): void {
    this.collectionForm = this.fb.group({
      title: ['', [this.formService.requiredValidator()]],
      description: ['', [this.formService.requiredValidator()]],
      is_public: [false],
      questions_ids:[[]],
      tags: ['']
    });
  }

  private handleDialogData(): void {
    const data = this.dialogConfig.data;
    if (data?.collection) {
      this.isEditMode.set(true);
      this.collectionId.set(data.collection);
      this.loadCollectionData(data.collection);
    }
  }

  private async loadCollectionData(collectionId: string): Promise<void> {
    try {
      const collection = await firstValueFrom(this.collectionsService.findOne(collectionId) as Observable<ICollection>);
      if (collection) {
        this.collectionForm.patchValue({
          title: collection.title,
          description: collection.description,
          is_public: collection.is_public || false,
          questions_ids: collection.questions_ids || [],
          tags: collection.tags ? collection.tags.join(', ') : ''
        });

        this.selectedQuestions.set(collection.questions_ids || []);
      }
    }
    catch (error) {
      this.notificationService.toastError('Erro ao carregar dados da coleção.');
      this.handleCancel();
    }
  }

  normalizeTags(tags: string): string[] {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  handleSave(): void {
    if (!this.formService.validateForm(this.collectionForm)) {
      return;
    }

    this.isSaving.set(true);
    const formData = this.collectionForm.getRawValue();
    const collectionData: ICollection = {
      id: this.isEditMode() ? (this.collectionId() ?? undefined) : undefined,
      title: formData.title,
      description: formData.description,
      author_id: this.user().id,
      is_public: formData.is_public,
      is_liked: false,
      questions_ids: this.selectedQuestions() || [],
      tags: formData.tags ? this.normalizeTags(formData.tags): []
    };

    this.collectionsService.createOrUpdateWithQuestions(collectionData).subscribe({
      next: () => {
        const message = this.isEditMode()
          ? 'Coleção atualizada com sucesso!'
          : 'Coleção criada com sucesso!';
        this.notificationService.toastSuccess(message);
        this.dialogRef.close(true);
      },
      error: (error) => {
        const message = this.isEditMode()
          ? 'Erro ao atualizar coleção.'
          : 'Erro ao criar coleção.';
        this.notificationService.toastError(message);
        console.error(error);
        this.isSaving.set(false);
      }
    });
  }

  handleCancel(): void {
    this.dialogRef.close(false);
  }
}
