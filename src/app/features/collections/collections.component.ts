import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { BaseListComponent } from '../../components/base/base-list/base-list.component';
import { DynamicDataViewComponent } from "../../components/dynamic-data-view/dynamic-data-view.component";
import { CollectionCardComponent } from "./collection-card/collection-card.component";
import { AskDialogComponent } from '../../components/ask-dialog/ask-dialog.component';
import { NotificationService } from '../../services/notification/notification.service';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { CollectionShareComponent } from './collection-share/collection-share.component';
import { CollectionResponseComponent } from './collection-response/collection-response.component';
import { ICollection } from '../../entity/collection.interface';
import { CollectionsService } from '../../services/collections/collections.service';
import { en_CollectionPermissionType } from '../../entity/collectionPermissionType.interface';
import { ILikeCollection } from '../../entity/likeCollection.interface';
import { CollectionStatisticsComponent } from './collection-statistics/collection-statistics.component';

@Component({
  selector: 'collections',
  imports: [FormsModule, KhButtonComponent, InputTextModule, TooltipModule, DynamicDataViewComponent, CollectionCardComponent],
  providers: [DialogService],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent extends BaseListComponent<ICollection> {

  private dialogService = inject(DialogService)
  private collectionService = inject(CollectionsService);
  private notificationService = inject(NotificationService);

  filteredDataSource = computed<ICollection[]>(() => {
    if(this.optionSelect() === 'create_with_me') {
      return this.dataSource().filter(item => item.author?.id === this.user()?.id);
    }
    else if(this.optionSelect() === 'share_with_me') {
      return this.dataSource().filter(item => item.author?.id !== this.user()?.id);
    }
    else{
      return this.dataSource();
    }
  });

  ngOnInit() {
    this.configureData();
    this.setOptionSelect('all_collections');
    this.loadData(() => this.collectionService.findByUser(this.user().id));
  }

  configureData() {
    this.columnDefs.set([
      {
        field: 'title',
        header: 'Título',
        width: '20%',
      },
      {
        field: 'description',
        header: 'Descrição',
        width: '35%',
      },
      {
        field: 'author.name',
        header: 'Autor',
        width: '25%',
      },
      {
        field: 'created_at',
        header: 'Criado em',
        dataType: 'date',
        width: '20%',
        formatOptions: {
          dateFormat: 'dd/MM/yyyy',
        }
      }
    ]);

    this.actionsDef.set([
      {
        label: 'Excluir',
        icon: 'ti ti-trash',
        type: 'danger-light',
        onClick: (row: ICollection) => this.deleteCollection(row.id || '', row.author?.id == this.user()?.id),
        disabled: (row: ICollection) => row.author?.id !== this.user()?.id
      },
      {
        label: 'Compartilhar',
        icon: 'ti ti-share',
        onClick: (row: ICollection) => this.shareCollection(row.id || '', this.canShareCollection(row)),
        disabled: (row: ICollection) => !this.canShareCollection(row),
      },
      {
        label: 'Editar',
        icon: 'ti ti-pencil',
        onClick: (row: ICollection) => this.editCollection(row.id || '', this.canEditCollection(row)),
        disabled: (row: ICollection) =>  !this.canEditCollection(row)
      }
    ])
  }

  getUserCollectionAccess(row: ICollection): number {
    if (!row.author || !this.user()) {
      return en_CollectionPermissionType.VIEW;
    }
    if(row && row.permissions && row.permissions.length > 0) {
      const permission = row.permissions.find(p => p.user_id === this.user().id);
      if(permission) {
        return permission.permission_type_id;
      }
    }
    return en_CollectionPermissionType.VIEW;
  }

  canEditCollection(row: ICollection): boolean {
    if (!row.author || !this.user()) {
      return false;
    }
    const userAccess = this.getUserCollectionAccess(row);
    return userAccess === en_CollectionPermissionType.EDIT || userAccess === en_CollectionPermissionType.ADMIN || row.author.id === this.user().id;
  }

  canShareCollection(row: ICollection): boolean {
    if (!row.author || !this.user()) {
      return false;
    }
    const userAccess = this.getUserCollectionAccess(row);
    return userAccess === en_CollectionPermissionType.ADMIN || row.author.id === this.user().id;
  }

  createCollection(){
    const ref = this.dialogService.open(
      CollectionFormComponent,
      {
        header: '📚 Nova coleção',
        modal:true,
        closable: true,
        focusOnShow: false,
        width: '30rem',
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
      });
    ref.onClose.subscribe(() => {
      this.loadData(() => this.collectionService.findByUser(this.user().id));
    })
  }
  deleteCollection(id: string, canDelete: boolean = false) {
    if (!id) {
      console.error('Collection ID is null or undefined');
      return;
    }

    if (!canDelete) {
      this.notificationService.toastError('Você não tem permissão para excluir esta coleção.');
      return;
    }

    const ref = this.dialogService.open(
      AskDialogComponent,
      {
        header: 'Confirmar exclusão',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '25rem',
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        data: {
          title: 'Excluir coleção',
          message: 'Você tem certeza que deseja excluir esta coleção? Esta ação não pode ser desfeita.',
          confirmText: 'Excluir',
          cancelText: 'Cancelar'
        }
      }
    );

    ref.onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.collectionService.remove(id).subscribe({
          next: () => {
            this.notificationService.toastSuccess('Coleção excluída com sucesso!');
            this.loadData(() => this.collectionService.findByUser(this.user().id));
          },
          error: (error) => {
            this.notificationService.toastError('Erro ao excluir coleção.');
            console.error(error);
          }
        });
      }
    });
  }

  editCollection(id: string, canEditCollection: boolean = false) {
    if (!id) {
      console.error('Collection ID is null or undefined');
      return;
    }

    if (!canEditCollection) {
      this.notificationService.toastError('Você não tem permissão para editar esta coleção.');
      return;
    }

    const ref = this.dialogService.open(
      CollectionFormComponent,
      {
        header: '✍️ Editar coleção',
        modal:true,
        closable: true,
        focusOnShow: false,
        width: '30rem',
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
        data: {
          collection: id
        }
      });
    ref.onClose.subscribe(() => {
      this.loadData(() => this.collectionService.findByUser(this.user().id));
    })
  }

  shareCollection(id: string, canShareCollection: boolean = false) {
    if (!id) {
      console.error('Collection ID is null or undefined');
      return;
    }

    if (!canShareCollection) {
      this.notificationService.toastError('Você não tem permissão para compartilhar esta coleção.');
      return;
    }

    const ref = this.dialogService.open(
      CollectionShareComponent,
      {
        header: '🤝  Compartilhar coleção',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '32rem',
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        data: {
          collectionId: id
        }
      }
    );    ref.onClose.subscribe((result) => {});
  }
  likeCollection(event: { id: string, liked: boolean }, item: ICollection) {
    const form: ILikeCollection = {
      user_id: this.user().id,
      collection_id: event.id
    }
    this.collectionService.like(form).subscribe({
      error: (err) => {
        console.error('Error liking collection:', err);
        item.is_liked = !item.is_liked;
      }
    })
  }

  respondCollection(id: string) {
    if (!id) {
      console.error('Collection ID is null or undefined');
      return;
    }

    const ref = this.dialogService.open(
      CollectionResponseComponent,
      {
        header: '🎯 Responder Coleção',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '40rem',
        breakpoints: {
          '960px': '85vw',
          '640px': '95vw'
        },
        data: {
          collectionId: id
        }
      }
    );

    ref.onClose.subscribe((result) => {
      if (result?.completed) {
        this.notificationService.toastSuccess(
          `Coleção completada! ${result.correctAnswers}/${result.totalQuestions} respostas corretas.`
        );
      }
    });
  }

  showStatistics(id: string, canViewStatistics: boolean = false) {
    if (!canViewStatistics) {
      this.notificationService.toastError('Você não tem permissão para visualizar as estatísticas desta coleção.');
      return;
    }

    const ref = this.dialogService.open(
      CollectionStatisticsComponent,
      {
        header: '📊 Estatísticas da Coleção',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '40rem',
        breakpoints: {
          '960px': '85vw',
          '640px': '95vw'
        },
        data: {
          collectionId: id,
        }
      }
    );

  }

}
