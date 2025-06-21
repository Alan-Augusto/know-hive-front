import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IQuestion } from '../../entity/question.interface';
import { Observable } from 'rxjs';
import { ILikeQuestion } from '../../entity/likeQuestion.interface';

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
    return this.get(`${id}`);
  }

  update(id: string, data: IQuestion) {
    return this.patch(`${id}`, data);
  }

  remove(id: string) {
    return this.delete(`${id}`);
  }

  findByUser(id: string): Observable<IQuestion[]> {
    return this.get(`user/${id}`);
  }

  createWithAlternatives(data: IQuestion) {
    return this.post('with-alternatives', data);
  }

  like(data:ILikeQuestion){
    return this.post('like', data);
  }

}
