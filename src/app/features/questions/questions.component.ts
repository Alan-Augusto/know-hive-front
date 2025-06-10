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

  ngOnInit() {
    this.configureData();
    this.setOptionSelect('question');
    this.loadData(() => this.questionService.findAll());
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
      this.loadData(() => this.questionService.findAll());
    })
  }

}
