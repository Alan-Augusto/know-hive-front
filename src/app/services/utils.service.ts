import { inject, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { IReturn } from '../entity/return.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private notificationService = inject(NotificationService);

  public validateApiResponse(response: IReturn):any {
    if(response.status === 'error') {
      this.notificationService.toastError(response.message);
      return false;
    }
    return true;
  }
}
