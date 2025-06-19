import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { ICollectionUserAccess } from '../../entity/collectionUserAccess.interface';

@Injectable({
  providedIn: 'root'
})
export class CollectionUserAccessService extends BaseApiService {

  override entityUrl = '/rel-collection-user-access';

  create(data: ICollectionUserAccess) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`${id}`);
  }

  update(id: string, data: Partial<ICollectionUserAccess>) {
    return this.patch(`${id}`, data);
  }

  remove(id: string) {
    return this.delete(`${id}`);
  }

  findAllByCollection(collectionId: string) {
    return this.get(`collection/${collectionId}`);
  }

  grantAccess(giverUserId: string, collectionId: string, receiverEmail: string, accessTypeId: number) {
    const data = {
      giverUserId,
      collectionId,
      receiverEmail,
      accessTypeId
    };
    return this.post('grant-access', data);
  }

}
