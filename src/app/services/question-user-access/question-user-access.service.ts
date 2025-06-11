import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IQuestionUserAccess } from '../../entity/questionUserAccess.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionUserAccessService extends BaseApiService {

  override entityUrl = '/question-user-access';

  create(data: IQuestionUserAccess) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: number) {
    return this.get(`${id}`);
  }

  update(id: number, data: IQuestionUserAccess) {
    return this.patch(`${id}`, data);
  }

  remove(id: number) {
    return this.delete(`${id}`);
  }

}
