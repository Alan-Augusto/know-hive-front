import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService extends BaseApiService {

  override entityUrl = '/collections';
}
