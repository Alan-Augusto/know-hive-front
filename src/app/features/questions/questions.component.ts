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
@Component({
  selector: 'questions',
  imports: [FormsModule, KhButtonComponent, InputTextModule, TooltipModule ],
  providers:[DialogService],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent extends BaseListComponent<IQuestion> {

  private dialogService = inject(DialogService)

  ngOnInit() {
    this.setOptionSelect('question');
    // loadData();
  }

  createQuestion(){
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
        header: 'TESTE',
        modal:true,
        closable: true,
        focusOnShow: false,
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
      });
  }

}
