import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { UtilsService } from './services/utils.service';
import { MenuComponent } from './components/menu/menu.component';
import { LayoutComponent } from "./features/layout/layout.component";
import { NotificationService } from './services/notification/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    Toast,
    LayoutComponent
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
  title = 'know-hive-front';
}
