import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { ICollectionPermissionType } from '../../entity/collectionPermissionType.interface';

@Injectable({
  providedIn: 'root'
})
export class CollectionPermissionTypeService extends BaseApiService {

  override entityUrl = '/collection-permission-type';

  create(data: ICollectionPermissionType) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: number) {
    return this.get(`/${id}`);
  }

  update(id: number, data: any) {
    return this.patch(`/${id}`, data);
  }

  remove(id: number) {
    return this.delete(`/${id}`);
  }

}
