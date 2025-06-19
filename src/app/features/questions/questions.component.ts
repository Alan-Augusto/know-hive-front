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
    this.setOptionSelect('all_questions');
    this.loadData(() => this.questionService.findByUser(this.user().id));
  }

  configureData() {
    this.columnDefs.set([
      {
        field: 'statement',
        header: 'Descrição'
      },
      {
        field: 'type.name',
        header: 'Tipo',
      },
      {
        field: 'author.name',
        header: 'Autor',
      },
      {
        field: 'created_at',
        header: 'Criado em',
        dataType: 'date',
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
        onClick: (row: IQuestion) => this.deleteQuestion(row.id || ''),
        disabled: (row: IQuestion) => row.author?.id !== this.user()?.id
      },
      {
        label: 'Compartilhar',
        icon: 'ti ti-share',
        onClick: (row: IQuestion) => this.shareQuestion(row.id || ''),
        disabled: (row: IQuestion) => row.author?.id !== this.user()?.id
      },
      {
        label: 'Editar',
        icon: 'ti ti-pencil',
        onClick: function (row: any): void {
          throw new Error('Function not implemented.');
        }
      }
    ])
  }

  createQuestion(){
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
        header: '✍️Nova questão',
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
      this.loadData(() => this.questionService.findByUser(this.user().id));
    })
  }

  deleteQuestion(id: string) {
    if (!id) {
      console.error('Question ID is null or undefined');
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

  editQuestion(id:string){
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
        header: '✍️Editar questão',
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

  shareQuestion(id: string) {
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

}
