import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { ICollection } from '../../entity/collection.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService extends BaseApiService {

  override entityUrl = '/collections';

  create(data: ICollection) {
    return this.post('', data);
  }

  findAll(): Observable<ICollection[]> {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`/${id}`);
  }

  update(id: string, data: ICollection) {
    return this.patch(`/${id}`, data);
  }

  remove(id: string) {
    return this.delete(`/${id}`);
  }

  findByUser(id: string): Observable<ICollection[]> {
    return this.get(`user/${id}`);
  }

}
