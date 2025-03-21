import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonDemo } from "./components/button-demo/button-demo.component";
import { AuthenticationComponent } from "./features/authentication/authentication.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { NotificationService } from './services/notification.service';
import { UtilsService } from './services/utils.service';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule, 
    CommonModule, 
    Toast
  ],
  providers: [
    MessageService,
    NotificationService,
    UtilsService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'teste_projeto_angular';
}
