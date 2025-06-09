import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService extends BaseApiService {

  override entityUrl = '/media';

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post(`upload-image`, formData);

  }
}
