import { Component, inject } from '@angular/core';
import { BaseListComponent } from '../../../components/base/base-list/base-list.component';
import { QuestionsService } from '../../../services/questions/questions.service';

@Component({
  selector: 'list-questions',
  imports: [],
  templateUrl: './list-questions.component.html',
  styleUrl: './list-questions.component.scss'
})
export class ListQuestionsComponent extends BaseListComponent {

  private readonly questionsService = inject(QuestionsService);

  ngOnInit() {
    this.loadData(() => this.questionsService.findAllForUser(this.user().id));
  }

}
