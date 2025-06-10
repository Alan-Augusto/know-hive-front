import { Component, computed, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '../../components/base/base-list/base-list.component';
import { IQuestion } from '../../entity/question.interface';

@Component({
  selector: 'questions',
  imports: [FormsModule, KhButtonComponent, InputTextModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent extends BaseListComponent<IQuestion> {

  ngOnInit() {
    // loadData();
  }

}
