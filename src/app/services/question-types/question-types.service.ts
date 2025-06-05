import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionTypesService extends BaseApiService {

  override entityUrl = '/question-types';
}
