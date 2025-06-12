import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IQuestionUserAccess } from '../../entity/questionUserAccess.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionUserAccessService extends BaseApiService {

  override entityUrl = '/rel-question-user-access';

  create(data: IQuestionUserAccess) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`${id}`);
  }

  update(id: string, data: IQuestionUserAccess) {
    return this.patch(`${id}`, data);
  }

  remove(id: string) {
    return this.delete(`${id}`);
  }

  findAllByQuestion(questionId: string) {
    return this.get(`question/${questionId}`);
  }

  grantAccess(giverUserId: string, questionId:string, receiverEmail: string, accessTypeId: number){
    const data = {
      giverUserId,
      questionId,
      receiverEmail,
      accessTypeId
    };
    return this.post('grant-access', data);
  }

}
