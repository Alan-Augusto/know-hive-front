import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IUser } from '../../entity/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseApiService {

  override entityUrl = '/users';

  create(data: IUser) {
    return this.post('', data);
  }

  findAll() {
    return this.get('');
  }

  findOne(id: string) {
    return this.get(`${id}`);
  }

  update(id: string, data: IUser) {
    return this.patch(`${id}`, data);
  }

  remove(id: string) {
    return this.delete(`${id}`);
  }

}
