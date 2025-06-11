import { Component, inject, input, output } from '@angular/core';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { IQuestion } from '../../../entity/question.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { QuestionsService } from '../../../services/questions/questions.service';
import { AskDialogComponent } from '../../../components/ask-dialog/ask-dialog.component';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'question-card',
  imports: [KhButtonComponent, DatePipe, TooltipModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent {
  item = input.required<IQuestion>();
  onDelete = output<string>();
  onShare = output<string>();
  onEdit = output<string>();

  deleteQuestion(id:string|null){
    if(!id) return;
    this.onDelete.emit(id);
  }

  shareQuestion(id:string|null){
    if(!id) return;
    this.onShare.emit(id);
  }

  editQuestion(id:string|null){
    if(!id) return;
    this.onEdit.emit(id);
  }

}
