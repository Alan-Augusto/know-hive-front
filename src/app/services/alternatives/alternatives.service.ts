import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IAlternative } from '../../entity/alternative.interface';

@Injectable({
  providedIn: 'root'
})
export class AlternativesService extends BaseApiService {

  override entityUrl = '/alternatives';

  create(alternative: IAlternative) {
    return this.post('', alternative);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`/${id}`);
  }

  update(id: string, alternative: IAlternative) {
    return this.put(`/${id}`, alternative);
  }

  remove(id: string) {
    return this.delete(`/${id}`);
  }
}
