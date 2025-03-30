import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {

  override entityUrl = '/users';

  existsByEmail(email: string) {
    return this.get(`existsByEmail/${email}`);
  }

  login(data: any) {
    return this.post('login', data);
  }

  register(data: any) {
    return this.post('register', data);
  }
  
}
