import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IQuestion } from '../../entity/question.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends BaseApiService {

  override entityUrl = '/questions';

  create(data: IQuestion) {
    return this.post('', data);
  }

  findAll(): Observable<IQuestion[]> {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`/${id}`);
  }

  update(id: string, data: IQuestion) {
    return this.patch(`/${id}`, data);
  }

  remove(id: string) {
    return this.delete(`/${id}`);
  }

}
