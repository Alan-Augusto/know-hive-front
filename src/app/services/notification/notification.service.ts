import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private messageService = inject(MessageService);

  toastError(message: string) {
    this.messageService.add({severity:'error', summary:'Erro', detail: message});
  }

  toastSuccess(message: string) {
    this.messageService.add({severity:'success', summary:'Sucesso', detail: message});
  }

  toastInfo(message: string) {
    this.messageService.add({severity:'info', summary:'Informação', detail: message});
  }

  toastWarn(message: string) {
    this.messageService.add({severity:'warn', summary:'Atenção', detail: message});
  }

  toastCustom(severity: string, summary: string, detail: string) {
    this.messageService.add({severity, summary, detail});
  }
}
