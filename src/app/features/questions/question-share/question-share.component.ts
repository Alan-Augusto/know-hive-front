import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { FormService } from '../../../services/utils/form.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { ICollectionPermissionType } from '../../../entity/collectionPermissionType.interface';
import { CollectionPermissionTypeService } from '../../../services/collection-permission-type/collection-permission-type.service';
import { IQuestionUserAccess } from '../../../entity/questionUserAccess.interface';

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

  isSharing = signal<boolean>(false);

  // Mock data for permission types
  permissionTypes = signal<ICollectionPermissionType[]>([]);

  shareList = signal<IQuestionUserAccess[]>([
    {
      id: '1',
      user_id: '123456',
      question_id: '987654',
      permission_type_id: 1,
      user: {
        id: '123456',
        email: 'fulaninho@outlook.com',
        name: 'Fulano de Tal',
        profile_picture: 'https://notion-avatar.app/api/svg/eyJmYWNlIjo2LCJub3NlIjo1LCJtb3V0aCI6MTcsImV5ZXMiOjAsImV5ZWJyb3dzIjo0LCJnbGFzc2VzIjoxMCwiaGFpciI6MTMsImFjY2Vzc29yaWVzIjowLCJkZXRhaWxzIjowLCJiZWFyZCI6MCwiZmxpcCI6MCwiY29sb3IiOiJyZ2JhKDI1NSwgMCwgMCwgMCkiLCJzaGFwZSI6Im5vbmUifQ=='
      }
    },
    {
      id: '2',
      user_id: '654321',
      question_id: '987654',
      permission_type_id: 2,
      user: {
        id: '654321',
        email: 'beltrano@gmail.com',
        name: 'Beltrano Silva',
        profile_picture: 'https://notion-avatar.app/api/svg/eyJmYWNlIjo0LCJub3NlIjozLCJtb3V0aCI6MTAsImV5ZXMiOjEsImV5ZWJyb3dzIjozLCJnbGFzc2VzIjo4LCJoYWlyIjo4LCJhY2Nlc3NvcmllcyI6MSwiZGV0YWlscyI6MSwiYmVhcmQiOjEsImZsaXAiOjEsImNvbG9yIjoicmdiYSgwLCAxMjgsIDI1NSwgMCkiLCJzaGFwZSI6Im5vbmUifQ=='
      }
    },
    {
      id: '3',
      user_id: '789012',
      question_id: '987654',
      permission_type_id: 3,
      user: {
        id: '789012',
        email: 'ciclana@empresa.com',
        name: 'Ciclana Pereira',
        profile_picture: 'https://notion-avatar.app/api/svg/eyJmYWNlIjozLCJub3NlIjo0LCJtb3V0aCI6MTIsImV5ZXMiOjIsImV5ZWJyb3dzIjo1LCJnbGFzc2VzIjo3LCJoYWlyIjo5LCJhY2Nlc3NvcmllcyI6MiwiZGV0YWlscyI6MiwiYmVhcmQiOjIsImZsaXAiOjIsImNvbG9yIjoicmdiYSgyNTUsIDI1NSwgMCwgMCkiLCJzaGFwZSI6Im5vbmUifQ=='
      }
    }
  ]);

  formGroup: FormGroup = this.fb.group({
    email: [null, [this.formService.requiredValidator(), this.formService.emailValidator()]],
    permission: [null, [this.formService.requiredValidator()]],
  });

  ngOnInit() {
    this.loadPermissionTypes();
    this.formGroup.controls['permission'].setValue(this.shareList()[0].id); // Default permission
  }

  loadPermissionTypes() {
    this.collectionPermissionTypeService.findAll().subscribe({
      next: (data) => {
        this.permissionTypes.set(data as ICollectionPermissionType[]);
        console.log('Tipos de permissão carregados:', this.permissionTypes());
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao carregar os tipos de permissão.');
        console.error(error);
        this.dynamicDialogRef.close();
      }
    });
  }

  handleShare() {
    if (!this.formService.validateForm(this.formGroup)) {
      this.notificationService.toastError('Verifique os campos do formulário.');
      return;
    }

    this.isSharing.set(true);

    const shareData = this.formGroup.getRawValue();

    // Simulate API call
    setTimeout(() => {
      this.isSharing.set(false);
      this.notificationService.toastSuccess('Convite enviado com sucesso!');
      this.dynamicDialogRef.close(shareData);
    }, 2000);
  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }
}
