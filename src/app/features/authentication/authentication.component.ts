import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { NotificationService } from '../../services/notification/notification.service';
import { Router } from '@angular/router';
import { FormService } from '../../services/utils/form.service';
import { AuthBaseComponent } from "../../components/auth-base/auth-base.component";
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-authentication',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, AuthBaseComponent, KhButtonComponent],
  providers: [AuthService],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);

  authForm!: FormGroup;
  showRegistration = signal<boolean>(false);
  userExists = signal<boolean>(false);
  isCheckingEmail = signal<boolean>(false);

  ngOnInit() {
    this.authForm = this.fb.group({
      email: ['', [this.formService.requiredValidator(), this.formService.emailValidator()]],
      password: ['', []]
    });

    this.formService.validateFormErrors(this.authForm);
  }

  onVerifyEmail() {
    if(this.authForm.invalid) {
      this.notificationService.toastError('Email inválido');
      return;
    }

    this.authService.ExistEmail(this.authForm.controls['email'].value).subscribe({
      next: (res:any) => {
        const exists:boolean = res as boolean;

        if(exists){
          this.userExists.set(true);
          this.isCheckingEmail.set(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.notificationService.toastError('Erro ao verificar email');
        this.isCheckingEmail.set(false);
      },
      complete: () => {
        if(this.userExists()){
            this.router.navigate(['/login'], { queryParams: { email: this.authForm.controls['email'].value } });
        }
        else{
            this.router.navigate(['/register'], { queryParams: { email: this.authForm.controls['email'].value } });
        }
      }
    });

    this.isCheckingEmail.set(true);

  }

}
