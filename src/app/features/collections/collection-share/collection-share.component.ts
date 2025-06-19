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
import { ICollectionUserAccess } from '../../../entity/collectionUserAccess.interface';
import { CollectionUserAccessService } from '../../../services/collection-user-access/collection-user-access.service';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';

@Component({
  selector: 'collection-share',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    KhButtonComponent
  ],
  templateUrl: './collection-share.component.html',
  styleUrl: './collection-share.component.scss'
})
export class CollectionShareComponent {
  private fb = inject(FormBuilder);
  private dynamicDialogRef = inject(DynamicDialogRef);
  private formService = inject(FormService);
  private notificationService = inject(NotificationService);
  private collectionPermissionTypeService = inject(CollectionPermissionTypeService);
  private collectionUserAccessService = inject(CollectionUserAccessService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private loggedUserService = inject(LoggedUserService);

  user = computed(() => this.loggedUserService.loggedUser());
  isSharing = signal<boolean>(false);
  collectionId = signal<string>('');
  permissionTypes = signal<ICollectionPermissionType[]>([]);
  shareList = signal<ICollectionUserAccess[]>([]);

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
    if (data?.collectionId) {
      this.collectionId.set(data.collectionId);
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
    this.collectionUserAccessService.findAllByCollection(this.collectionId()).subscribe({
      next: (data) => {
        this.shareList.set(data as ICollectionUserAccess[]);
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao carregar a lista de compartilhamento.');
        console.error(error);
        this.dynamicDialogRef.close();
      }
    });
  }

  handleShare() {
    if(!this.formService.validateForm(this.formGroup)) {
      return;
    }
    this.isSharing.set(true);

    const email = this.formGroup.controls['email'].value;
    const permissionId = this.formGroup.controls['permission'].value;

    this.collectionUserAccessService.grantAccess(this.user().id, this.collectionId(), email, permissionId).subscribe({
      next: (data) => {
        this.notificationService.toastSuccess('Coleção compartilhada com sucesso!');
        this.loadShareList();
        this.formGroup.reset();
        this.formGroup.controls['permission'].setValue(this.permissionTypes()[0].id);
        this.isSharing.set(false);
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao compartilhar coleção.');
        console.error(error);
        this.isSharing.set(false);
      }
    })
  }

  handleDeleteShare(shareId: string) {
    this.collectionUserAccessService.remove(shareId).subscribe({
      next: (data) => {
        this.notificationService.toastSuccess('Compartilhamento removido com sucesso!');
        this.loadShareList();
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao remover compartilhamento.');
        console.error(error);
      }
    })
  }

  handlePermissionChange(id:string, permissionId: number) {
    this.collectionUserAccessService.update(id, {permission_type_id: permissionId}).subscribe({
      next: (data) => {
        this.notificationService.toastSuccess('Permissão atualizada com sucesso!');
        this.loadShareList();
      },
      error: (error) => {
        this.notificationService.toastError('Erro ao atualizar permissão.');
        console.error(error);
      }
    })
  }

  handleCancel() {
    this.dynamicDialogRef.close();
  }
}
