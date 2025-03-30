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
import { UtilsService } from '../../services/utils.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { FormService } from '../../services/utils/form.service';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private utils = inject(UtilsService);
  private loggedUser = inject(LoggedUserService);
  private formService = inject(FormService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);
  private router = inject(Router);

  loginForm!: FormGroup;
  isCheckingLogin: Boolean = false;
  emailParam!: string;
  existsEmail!: boolean;

  isLogged:boolean = false;

  ngOnInit() {

    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.emailParam = queryParams['email'];

    if(this.emailParam) this.existsEmail = true;

    this.loginForm = this.fb.group({
      email: [this.emailParam || null, [this.formService.requiredValidator(), this.formService.emailValidator()]],
      password: [null, [this.formService.requiredValidator()]]
    });

    this.formService.validateFormErrors(this.loginForm);

    if(this.existsEmail) this.loginForm.controls['email'].disable();
  }


  handleLogin() {
    if(this.loginForm.invalid) {
      this.notificationService.toastError('Email ou senha inválidos');
      return;
    }
    
    this.isCheckingLogin = true;
    this.userService.login(this.loginForm.getRawValue()).subscribe({
      next: (res:any) => {
        const apiResponse:IReturn = res as IReturn;

        if(this.utils.validateApiResponse(apiResponse)){
          if(apiResponse.data.token){
            this.loggedUser.setUser(apiResponse.data.user);
            this.loggedUser.setToken(apiResponse.data.token);
            this.notificationService.toastSuccess(apiResponse.message);
            this.isCheckingLogin = false;
            this.router.navigate(['/home']);
          }
          else{
            this.notificationService.toastError(apiResponse.message);
          }
        }
      },
      error: (err:any) => {
        const apiResponse:IReturn = err.error as IReturn;
        this.notificationService.toastError(apiResponse.message);
        this.isCheckingLogin = false;
      },
      complete: () => {}
    });
  }

}
