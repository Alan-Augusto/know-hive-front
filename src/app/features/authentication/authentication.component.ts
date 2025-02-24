import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDemo } from "../../components/button-demo/button-demo.component";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-authentication',
  imports: [ButtonDemo, Toast, InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule],
  providers: [NotificationService, UserService],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);
  authForm!: FormGroup;
  registerForm!: FormGroup;
  showRegistration = false;
  userExists = false;
  isCheckingEmail = false;

  ngOnInit() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', []]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassowrd: ['', [Validators.required]]
    });
  }

  onVerifyEmail() {
    if(this.authForm.invalid) {
      this.notificationService.toastError('Email inválido');
      return;
    }
    
    this.userService.existsByEmail(this.authForm.controls['email'].value).subscribe({
      next: (response:any) => {
        console.log(response);
        if (response?.exists){
          this.userExists = true;
          this.isCheckingEmail = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.toastError('Erro ao verificar email');
        this.isCheckingEmail = false
        
      }
    });

    this.isCheckingEmail = true;

  }

}
