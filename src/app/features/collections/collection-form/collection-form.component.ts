import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { ICollection } from '../../../entity/collection.interface';
import { CollectionsService } from '../../../services/collections/collections.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { FormService } from '../../../services/utils/form.service';

@Component({
  selector: 'collection-form',
  imports: [InputTextModule, TextareaModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, KhButtonComponent],
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
      description: ['', [this.formService.requiredValidator()]]
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
      const collection = await this.collectionsService.findOne(collectionId).toPromise() as ICollection;
      if (collection) {
        this.collectionForm.patchValue({
          title: collection.title,
          description: collection.description
        });
      }
    } catch (error) {
      this.notificationService.toastError('Erro ao carregar dados da coleção.');
      this.handleCancel();
    }
  }

  handleSave(): void {
    if (!this.formService.validateForm(this.collectionForm)) {
      return;
    }

    this.isSaving.set(true);
    const formData = this.collectionForm.getRawValue();

    const collectionData: ICollection = {
      title: formData.title,
      description: formData.description,
      author_id: this.user().id
    };

    const saveOperation = this.isEditMode()
      ? this.collectionsService.update(this.collectionId()!, collectionData)
      : this.collectionsService.create(collectionData);

    saveOperation.subscribe({
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
