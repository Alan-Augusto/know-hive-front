import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IAlternative } from '../../entity/alternative.interface';

@Injectable({
  providedIn: 'root'
})
export class AlternativesService extends BaseApiService {

  override entityUrl = '/alternatives';

  create(data: IAlternative) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`/${id}`);
  }

  update(id: string, data: IAlternative) {
    return this.patch(`/${id}`, data);
  }

  remove(id: string) {
    return this.delete(`/${id}`);
  }
}
