import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {

  override entityUrl = '/auth';
}
