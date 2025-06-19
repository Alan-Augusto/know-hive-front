import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { FormService } from '../../../services/utils/form.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { ICollectionPermissionType } from '../../../entity/collectionPermissionType.interface';
import { CollectionPermissionTypeService } from '../../../services/collection-permission-type/collection-permission-type.service';
import { IQuestionUserAccess } from '../../../entity/questionUserAccess.interface';
import { QuestionUserAccessService } from '../../../services/question-user-access/question-user-access.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';

@Component({
  selector: 'question-share',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    KhButtonComponent
  ],
  templateUrl: './question-share.component.html',
  styleUrl: './question-share.component.scss'
})
export class QuestionShareComponent {
  private fb = inject(FormBuilder);
  private dynamicDialogRef = inject(DynamicDialogRef);
  private formService = inject(FormService);
  private notificationService = inject(NotificationService);
  private collectionPermissionTypeService = inject(CollectionPermissionTypeService);
  private questionUserAccessService = inject(QuestionUserAccessService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private loggedUserService = inject(LoggedUserService);

  user = computed(() => this.loggedUserService.loggedUser());
  isSharing = signal<boolean>(false);
  questionId = signal<string>('');
  permissionTypes = signal<ICollectionPermissionType[]>([]);
  shareList = signal<IQuestionUserAccess[]>([]);

  formGroup: FormGroup = this.fb.group({
    email: [null, [this.formService.requiredValidator(), this.formService.emailValidator()]],
    permission: [null, [this.formService.requiredValidator()]],
  });

  ngOnInit() {
    this.receiveData();
    this.loadPermissionTypes();
    this.loadShareList();
  }

    receiveData() {
    const data = this.dynamicDialogConfig.data;
    if (data && data.questionId) {
      this.questionId.set(data.questionId);
    }
    else{
      this.notificationService.toastError('Erro ao abrir opção de compartilhamento.');
      this.dynamicDialogRef.close();
    }
  }

  loadPermissionTypes() {
    this.collectionPermissionTypeService.findAll().subscribe({
      next: (data) => {
        this.permissionTypes.set(data as ICollectionPermissionType[]);
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao carregar os tipos de permissão.');
        console.error(error);
        this.dynamicDialogRef.close();
      },
      complete:()=>{
        this.formGroup.controls['permission'].setValue(this.permissionTypes()[0].id);
      }
    });
  }

  loadShareList(){
    this.questionUserAccessService.findAllByQuestion(this.questionId()).subscribe({
      next: (data) => {
        this.shareList.set(data as IQuestionUserAccess[]);
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao carregar a lista de compartilhamento.');
        console.error(error);
        this.dynamicDialogRef.close();
      }
    });
  }

  handleShare() {
    const email = this.formGroup.value.email;
    const permissionId = this.formGroup.value.permission;

    if (!this.formService.validateForm(this.formGroup)) {
      this.notificationService.toastError('Verifique os campos do formulário.');
      return;
    }
    if (this.isSharing()) {
      this.notificationService.toastInfo('Já está processando o compartilhamento.');
      return;
    }
    if (email == this.user().email) {
      this.notificationService.toastError('Você não pode compartilhar uma questão com você mesmo.');
      this.formGroup.controls['email'].setErrors({ 'invalid': true });
      return;
    }

    this.isSharing.set(true);
    this.questionUserAccessService.grantAccess(this.user().id, this.questionId(), email, permissionId).subscribe({
      next: (data) => {
        this.notificationService.toastSuccess('Acesso concedido com sucesso!');
        this.loadShareList();
        this.formGroup.reset({
          email: null,
          permission: this.permissionTypes()[0]?.id || null
        });
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao conceder acesso.');
        this.isSharing.set(false);
        console.error(error);
      },
      complete: () => {
        this.isSharing.set(false);
      }
    })
  }

  handleDeleteShare(shareId: string) {
    if (!shareId) {
      this.notificationService.toastError('Erro ao remover o compartilhamento.');
      this.handleCancel();
      return;
    }

    this.questionUserAccessService.remove(shareId).subscribe({
      next: () => {},
      error: (error) => {
        this.notificationService.toastError('Erro ao remover o compartilhamento.');
        console.error(error);
      },
      complete: () => {
        this.notificationService.toastInfo('Permissão removida!');
        this.loadShareList();
      }
    });
  }

  handlePermissionChange(id:string, permissionId: number) {
    if (!id || !permissionId) {
      this.notificationService.toastError('Erro ao atualizar a permissão.');
      return;
    }

    this.questionUserAccessService.update(id, {permission_type_id:permissionId}).subscribe({
      next: () => {},
      error: (error) => {
        this.notificationService.toastError('Erro ao atualizar a permissão.');
        console.error(error);
      },
      complete: () => {
        this.notificationService.toastInfo('Permissão atualizada!');
        this.loadShareList();
      }
    });
  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }
}
