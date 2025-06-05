import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IAlternative } from '../../entity/alternative.interface';

@Injectable({
  providedIn: 'root'
})
export class AlternativesService extends BaseApiService {

  override entityUrl = '/alternatives';

  create(createAlternativeDto: IAlternative) {
    return this.post('', createAlternativeDto);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`/${id}`);
  }

  update(id: string, updateAlternativeDto: IAlternative) {
    return this.put(`/${id}`, updateAlternativeDto);
  }

  remove(id: string) {
    return this.delete(`/${id}`);
  }
}
