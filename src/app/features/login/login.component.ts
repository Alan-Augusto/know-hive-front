import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../services/notification/notification.service';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { FormService } from '../../services/utils/form.service';
import { AuthBaseComponent } from "../../components/auth-base/auth-base.component";
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule, AuthBaseComponent, KhButtonComponent],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private formService = inject(FormService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService)

  loginForm!: FormGroup;
  isCheckingLogin: boolean = false;
  emailParam!: string;
  existsEmail!: boolean;

  isLogged:boolean = false;

  ngOnInit() {
    this.initializeForm();
    this.handleQueryParams();
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: [null, [this.formService.requiredValidator(), this.formService.emailValidator()]],
      password: [null, [this.formService.requiredValidator()]],
    });
  }

  private handleQueryParams() {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.emailParam = queryParams['email'];
    this.existsEmail = !!this.emailParam;

    if (this.existsEmail) {
      this.loginForm.controls['email'].setValue(this.emailParam);
      this.loginForm.controls['email'].disable();
    }
    else{
      this.router.navigate(['/auth']);
    }
  }

  handleLogin() {
    if (!this.formService.validateForm(this.loginForm)) {
      this.notificationService.toastError('Email ou senha inválidos');
      return;
    }
    // Adicione a lógica de login aqui
  }

}
