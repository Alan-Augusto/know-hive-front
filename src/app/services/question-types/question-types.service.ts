import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IQuestionType } from '../../entity/quentionType.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionTypesService extends BaseApiService {

  override entityUrl = '/question-types';

  create(data: IQuestionType) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: number) {
    return this.get(`/${id}`);
  }

  update(id: number, data: IQuestionType) {
    return this.patch(`/${id}`, data);
  }

  remove(id: number) {
    return this.delete(`/${id}`);
  }

}
