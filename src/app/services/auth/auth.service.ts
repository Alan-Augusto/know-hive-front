import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { ILoginAuth } from '../../entity/loginAuth.interface';
import { IRegisterAuth } from '../../entity/registerAuth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {

  override entityUrl = '/auth';

  login(data: ILoginAuth) {
    return this.post('/login', data);
  }

  ExistEmail(email: string) {
    return this.get(`/exist-email/${encodeURIComponent(email)}`);
  }

  register(data: IRegisterAuth) {
    return this.post('/register', data);
  }

}
