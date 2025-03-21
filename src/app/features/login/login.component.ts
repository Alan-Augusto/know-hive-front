import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { IReturn } from '../../entity/return.interface';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // private utils = inject(UtilsService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);
  private router = inject(Router);

  loginForm!: FormGroup;
  isCheckingLogin: Boolean = false;
  emailParam!: string;
  existsEmail!: boolean;

  ngOnInit() {

    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.emailParam = queryParams['email'];

    if(this.emailParam) this.existsEmail = true;

    this.loginForm = this.fb.group({
      email: [this.emailParam || null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }


  handleLogin() {
    if(this.loginForm.invalid) {
      this.notificationService.toastError('Email ou senha inválidos');
      return;
    }
    
    this.isCheckingLogin = true;
    this.userService.login(this.loginForm.value).subscribe({
      next: (res:any) => {
        const apiResponse:IReturn = res as IReturn;

        if(this.validateApiResponse(apiResponse)){
          this.router.navigate(['/home']);
        }
      },
      error: (err:any) => {
        this.notificationService.toastError('Erro ao realizar login');
      },
      complete: () => {
        this.isCheckingLogin = false;
      }
    });
  }

  validateApiResponse(response: IReturn):any {
    if(response.status === 'error') {
      this.notificationService.toastError(response.message);
      return false;
    }
    return true;
  }

}
