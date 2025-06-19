import { Component, computed, inject, input, output, signal } from '@angular/core';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ICollection } from '../../../entity/collection.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { CollectionsService } from '../../../services/collections/collections.service';
import { AskDialogComponent } from '../../../components/ask-dialog/ask-dialog.component';
import { NotificationService } from '../../../services/notification/notification.service';
import { en_CollectionPermissionType } from '../../../entity/collectionPermissionType.interface';
import { IUser } from '../../../entity/user.interface';

@Component({
  selector: 'collection-card',
  imports: [KhButtonComponent, DatePipe, TooltipModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.scss'
})
export class CollectionCardComponent {

  private notificationService = inject(NotificationService);

  item = input.required<ICollection>();
  user = input.required<IUser>();
  onDelete = output<string>();
  onShare = output<string>();
  onEdit = output<string>();

  isOwner = computed(() => this.item().author_id === this.user().id);
  permissionType = signal<en_CollectionPermissionType>(en_CollectionPermissionType.VIEW);
  canEdit = computed(() => this.permissionType() === en_CollectionPermissionType.EDIT || this.permissionType() === en_CollectionPermissionType.ADMIN || this.isOwner());
  canShare = computed(() =>  this.permissionType() === en_CollectionPermissionType.ADMIN || this.isOwner());
  canDelete = computed(() => this.isOwner());

  ngOnInit() {
    this.verifyPermissionType();
  }

  verifyPermissionType(){
    const item = this.item();
    if(item && item.permissions && item.permissions.length > 0) {
      const permission = item.permissions.find(p => p.user_id === this.user().id);
      if(permission) {
        this.permissionType.set(permission.permission_type_id);
      } else {
        this.permissionType.set(en_CollectionPermissionType.VIEW);
      }
    } else {
      this.permissionType.set(en_CollectionPermissionType.VIEW);
    }
  }

  deleteCollection(id:string|null){
    if(!id) return;
    if(!this.canDelete()) {
      this.notificationService.toastError('Você não tem permissão para excluir esta coleção.');
      return;
    }
    this.onDelete.emit(id);
  }

  shareCollection(id:string|null){
    if(!id) return;
    if(!this.canShare()) {
      this.notificationService.toastError('Você não tem permissão para compartilhar esta coleção.');
      return;
    }
    this.onShare.emit(id);
  }

  editCollection(id:string|null){
    if(!id) return;
    if(!this.canEdit()) {
      this.notificationService.toastError('Você não tem permissão para editar esta coleção.');
      return;
    }
    this.onEdit.emit(id);
  }

}
