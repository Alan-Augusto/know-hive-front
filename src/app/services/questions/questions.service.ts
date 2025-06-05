import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends BaseApiService {

  override entityUrl = '/questions';
}
