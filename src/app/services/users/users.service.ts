import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseApiService {

  override entityUrl = '/users';
}
