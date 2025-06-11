import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KhButtonComponent } from '../kh-button/kh-button.component';

@Component({
  selector: 'ask-dialog',
  imports: [KhButtonComponent],
  templateUrl: './ask-dialog.component.html',
  styleUrl: './ask-dialog.component.scss'
})
export class AskDialogComponent {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);

  prompt = signal<string>('');

  ngOnInit() {
    this.receiveData();
  }

  receiveData() {
    const data = this.dynamicDialogConfig.data;
    if (data && data.prompt) {
      this.prompt.set(data.prompt);
    }
    else {
      this.prompt.set('Você tem certeza que deseja prosseguir?');
    }
  }

  cancel() {
    this.dynamicDialogRef.close(false);
  }

  submit() {
    this.dynamicDialogRef.close(true);
  }

}
