import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '../../components/base/base-list/base-list.component';
import { IQuestion } from '../../entity/question.interface';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';
import { QuestionFormComponent } from './question-form/question-form.component';
import { QuestionsService } from '../../services/questions/questions.service';
import { Observable } from 'rxjs';
import { DynamicDataViewComponent } from "../../components/dynamic-data-view/dynamic-data-view.component";
import { DatePipe } from '@angular/common';
import { QuestionCardComponent } from "./question-card/question-card.component";
import { AskDialogComponent } from '../../components/ask-dialog/ask-dialog.component';
import { NotificationService } from '../../services/notification/notification.service';
import { QuestionShareComponent } from './question-share/question-share.component';
import { en_CollectionPermissionType } from '../../entity/collectionPermissionType.interface';
import { ILikeQuestion } from '../../entity/likeQuestion.interface';
import { QuestionResponseComponent } from './question-response/question-response.component';
import { QuestionStatisticsComponent } from './question-statistics/question-statistics.component';
@Component({
  selector: 'questions',
  imports: [FormsModule, KhButtonComponent, InputTextModule, TooltipModule, DynamicDataViewComponent, QuestionCardComponent],
  providers:[DialogService],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent extends BaseListComponent<IQuestion> {

  private dialogService = inject(DialogService)
  private questionService = inject(QuestionsService);
  private notificationService = inject(NotificationService);

  filteredDataSource = computed<IQuestion[]>(() => {
    // if(this.optionSelect() === 'create_with_me') {
    //   return this.dataSource().filter(item => item.author?.id === this.user()?.id);
    // }
    // else if(this.optionSelect() === 'share_with_me') {
    //         return this.dataSource().filter(item => item.author?.id !== this.user()?.id);
    // }
    // else{
    //   return this.dataSource();
    // }

    if(this.optionSelect() === 'create_with_me') {
      return this.dataSource().filter(item => item.author?.id === this.user()?.id);
    }
    else if(this.optionSelect() === 'share_with_me') {
      return this.dataSource().filter(item => item.author?.id !== this.user()?.id && item.shared_with_me === true);
    }
    else if(this.optionSelect() === 'liked') {
      return this.dataSource().filter(item => item.is_liked === true);
    }
    else{
      return this.dataSource();
    }
  });

  ngOnInit() {
    this.configureData();
    this.setOptionSelect('all_questions');
    this.loadData(() => this.questionService.findByUser(this.user().id));
  }

  configureData() {
    this.columnDefs.set([
      {
        field: 'title',
        header: 'Título',
        width: '15%',
      },
      {
        field: 'statement',
        header: 'Descrição',
        width: '35%',
      },
      {
        field: 'type.name',
        header: 'Tipo',
        width: '20%',
      },
      {
        field: 'author.name',
        header: 'Autor',
        width: '20%',
      },
      {
        field: 'created_at',
        header: 'Criado em',
        dataType: 'date',
        width: '10%',
        formatOptions: {
          dateFormat: 'dd/MM/yyyy',
        }
      }
    ]);    this.actionsDef.set([
      {
        label: 'Excluir',
        icon: 'ti ti-trash',
        type: 'danger-light',
        onClick: (row: IQuestion) => this.deleteQuestion(row.id || '', row.author?.id == this.user()?.id),
        disabled: (row: IQuestion) => row.author?.id !== this.user()?.id
      },
      {
        label: 'Compartilhar',
        icon: 'ti ti-share',
        onClick: (row: IQuestion) => this.shareQuestion(row.id || '', this.canShareQuestion(row)),
        disabled: (row: IQuestion) => !this.canShareQuestion(row),
      },
      {
        label: 'Editar',
        icon: 'ti ti-pencil',
        onClick: (row: IQuestion) => this.editQuestion(row.id || '', this.canEditQuestion(row)),
        disabled: (row: IQuestion) =>  !this.canEditQuestion(row)
      },
      {
        label: 'Estatísticas',
        icon: 'ti ti-chart-bar',
        onClick: (row: IQuestion) => this.showStatistics(row.id || '', this.canViewStatistics(row)),
        disabled: (row: IQuestion) => !this.canViewStatistics(row)
      }
    ])
  }

  getUserQuestionAcess(row: IQuestion): number {
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

  canEditQuestion(row: IQuestion): boolean {
    if (!row.author || !this.user()) {
      return false;
    }
    const userAccess = this.getUserQuestionAcess(row);
    return userAccess === en_CollectionPermissionType.EDIT || userAccess === en_CollectionPermissionType.ADMIN || row.author.id === this.user().id;
  }

  canShareQuestion(row: IQuestion): boolean {
    if (!row.author || !this.user()) {
      return false;
    }
    const userAccess = this.getUserQuestionAcess(row);
    return userAccess === en_CollectionPermissionType.ADMIN || row.author.id === this.user().id;
  }

  canViewStatistics(row: IQuestion): boolean {
    if (!row.author || !this.user()) {
      return false;
    }
    const userAccess = this.getUserQuestionAcess(row);
    return userAccess === en_CollectionPermissionType.ADMIN || row.author.id === this.user().id;
  }

  createQuestion(){
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
      header: '📝 Nova questão',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '30rem',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
    ref.onClose.subscribe(() => {
      this.loadData(() => this.questionService.findByUser(this.user().id));
    })
  }

  deleteQuestion(id: string, canDelete: boolean = false) {
    if (!id) {
      console.error('Question ID is null or undefined');
      return;
    }
    if (!canDelete) {
      this.notificationService.toastError('Você não tem permissão para excluir esta questão.');
      return;
    }
    const askDialog = this.dialogService.open(
      AskDialogComponent,
      {
        header: 'Excluir questão',
        width: '30rem',
        data: {
          prompt: 'Você tem certeza que deseja excluir esta questão?'
        },
        modal: true,
        closable: false,
        focusOnShow: false,

      }
    ).onClose.subscribe((result: any) => {
      if (result) {
        this.questionService.remove(id).subscribe({
          next: () => {
            this.notificationService.toastInfo('Questão excluída com sucesso!');
          },
          error: (err) => {
            console.error('Error deleting question:', err);
          },
          complete: () => {
            this.loadData(() => this.questionService.findByUser(this.user().id));
          }
        });
      }
    });

  }

  editQuestion(id:string, canEditQuestion: boolean = false) {
    if (!id) {
      console.error('Question ID is null or undefined');
      return;
    }
    if (!canEditQuestion) {
      this.notificationService.toastError('Você não tem permissão para editar esta questão.');
      return;
    }
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
        header: '✍️ Editar questão',
        modal:true,
        closable: true,
        focusOnShow: false,
        width: '30rem',
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
        data: {
          question: id
        }
      });
    ref.onClose.subscribe(() => {
      this.loadData(() => this.questionService.findByUser(this.user().id));
    })
  }

  shareQuestion(id: string, canShareQuestion: boolean = false) {
    if (!id) {
      console.error('Question ID is null or undefined');
      return;
    }
    if (!canShareQuestion) {
      this.notificationService.toastError('Você não tem permissão para compartilhar esta questão.');
      return;
    }
    const ref = this.dialogService.open(
      QuestionShareComponent,
      {
        header: '🤝 Compartilhar questão',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '32rem',
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        data: {
          questionId: id
        }
      }
    );

    ref.onClose.subscribe((result) => {});
  }

  likeQuestion(event: { id: string, liked: boolean }, item: IQuestion) {
    const form:ILikeQuestion ={
      user_id: this.user().id,
      question_id: event.id
    }
    this.questionService.like(form).subscribe({
      error: (err) => {
        console.error('Error liking question:', err);
        item.is_liked = !item.is_liked;
      }
    })
  }

  resolveQuestion(id: string) {
    if (!id) {
      console.error('Question ID is null or undefined');
      return;
    }
    const ref = this.dialogService.open(
      QuestionResponseComponent,
      {
        header: '✅ Resolver questão',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '30rem',
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        data: {
          questionId: id
        }
      });
    ref.onClose.subscribe(() => {
      this.loadData(() => this.questionService.findByUser(this.user().id));
    })
  }

  showStatistics(id: string, canViewStatistics: boolean = false) {
    if (!canViewStatistics) {
      this.notificationService.toastError('Você não tem permissão para visualizar as estatísticas desta questão.');
      return;
    }

    const ref = this.dialogService.open(
      QuestionStatisticsComponent,
      {
        header: '📊 Estatísticas da Questão',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '60rem',
        breakpoints: {
          '960px': '90vw',
          '640px': '95vw'
        },
        data: {
          questionId: id,
        }
      }
    );
  }

}
