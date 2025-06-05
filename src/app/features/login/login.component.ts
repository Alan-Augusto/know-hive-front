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

  loginForm!: FormGroup;
  isCheckingLogin: boolean = false;
  emailParam!: string;
  existsEmail!: boolean;

  isLogged:boolean = false;
  timePending:number = 0;

  ngOnInit() {

    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.emailParam = queryParams['email'];

    if(this.emailParam) this.existsEmail = true;

    const userAgent = navigator.userAgent;

    this.loginForm = this.fb.group({
      email: [this.emailParam || null, [this.formService.requiredValidator(), this.formService.emailValidator()]],
      password: [null, [this.formService.requiredValidator()]],
    });

    console.log(userAgent);

    this.formService.validateFormErrors(this.loginForm);

    if(this.existsEmail) this.loginForm.controls['email'].disable();
  }


  handleLogin() {
    if(!this.formService.validateForm(this.loginForm)) {
      this.notificationService.toastError('Email ou senha inválidos');
      return;
    }

    this.isCheckingLogin = true;
    // this.userService.login(this.loginForm.getRawValue()).subscribe({
    //   next: (res:any) => {
    //     console.log(res)
    //     const apiResponse:IReturn = res as IReturn;

    //     if(this.utils.validateApiResponse(apiResponse)){
    //       if(apiResponse.data.token){
    //         this.loggedUser.setUser(apiResponse.data.user);
    //         this.loggedUser.setToken(apiResponse.data.token);
    //         this.notificationService.toastSuccess(apiResponse.message);
    //         this.isCheckingLogin = false;
    //         this.router.navigate(['/home']);
    //       }
    //       else{
    //         this.notificationService.toastError(apiResponse.message);
    //         if(apiResponse.data.failed){
    //           this.timePending = apiResponse.data.time;
    //           this.startCountdown();
    //         }
    //         else{
    //           this.isCheckingLogin = false;
    //         }
    //       }
    //     }
    //   },
    //   error: (err:any) => {
    //     const apiResponse:IReturn = err.error as IReturn;
    //     this.notificationService.toastError(apiResponse.message);
    //     this.isCheckingLogin = false;
    //   },
    //   complete: () => {}
    // });
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.isCheckingLogin = true;
      this.timePending--;

      if (this.timePending <= 0) {
        this.isCheckingLogin = false;
        this.timePending = 0;
        clearInterval(interval);
      }
    }, 60000); // 60000ms = 1 minute
  }

}
