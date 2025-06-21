import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { TooltipModule } from 'primeng/tooltip';
import { IQuestion } from '../../../entity/question.interface';
import { NotificationService } from '../../../services/notification/notification.service';
import { en_CollectionPermissionType } from '../../../entity/collectionPermissionType.interface';
import { IUser } from '../../../entity/user.interface';
import { ButtonLikeComponent } from "../../../components/button-like/button-like.component";

@Component({
  selector: 'question-card',
  imports: [KhButtonComponent, TooltipModule, ButtonLikeComponent],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent {

  private notificationService = inject(NotificationService);

  item = input.required<IQuestion>();
  user = input.required<IUser>();
  onDelete = output<string>();
  onShare = output<string>();
  onEdit = output<string>();
  onLike = output<{id:string, liked:boolean}>();

  isOwner = computed(() => this.item().author_id === this.user().id);
  permissionType = signal<en_CollectionPermissionType>(en_CollectionPermissionType.VIEW);
  canEdit = computed(() => this.permissionType() === en_CollectionPermissionType.EDIT || this.permissionType() === en_CollectionPermissionType.ADMIN || this.isOwner());
  canShare = computed(() =>  this.permissionType() === en_CollectionPermissionType.ADMIN || this.isOwner());
  canDelete = computed(() => this.isOwner());

  liked = signal<boolean>(false);

  ngOnInit() {
    this.veifyPermissionType();
    this.liked.set(this.item()?.is_liked ?? false);
  }

  veifyPermissionType(){
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

  deleteQuestion(id:string|null){
    if(!id) return;
    if(!this.canDelete()) {
      this.notificationService.toastError('Você não tem permissão para excluir esta questão.');
      return;
    }
    this.onDelete.emit(id);
  }

  shareQuestion(id:string|null){
    if(!id) return;
    if(!this.canShare()) {
      this.notificationService.toastError('Você não tem permissão para compartilhar esta questão.');
      return;
    }
    this.onShare.emit(id);
  }

  editQuestion(id:string|null){
    if(!id) return;
    if(!this.canEdit()) {
      this.notificationService.toastError('Você não tem permissão para editar esta questão.');
      return;
    }
    this.onEdit.emit(id);
  }

  likeQuestion(id:string){
    if(!id) return;
    this.item().is_liked = this.liked();
    this.onLike.emit(
      {
        id: id,
        liked: this.liked()
      }
    );
  }

}
