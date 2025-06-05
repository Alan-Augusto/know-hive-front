import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../services/notification/notification.service';
import { IReturn } from '../../entity/return.interface';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { FormService } from '../../services/utils/form.service';
import { AuthBaseComponent } from "../../components/auth-base/auth-base.component";
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";

@Component({
  selector: 'app-authentication',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, AuthBaseComponent, KhButtonComponent],
  providers: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

  private utils = inject(UtilsService);
  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  authForm!: FormGroup;
  showRegistration = false;
  userExists = false;
  isCheckingEmail = false;

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

    // this.userService.existsByEmail(this.authForm.controls['email'].value).subscribe({
    //   next: (res:any) => {
    //     const apiResponse:IReturn = res as IReturn;

    //     if(this.utils.validateApiResponse(apiResponse)){
    //       this.userExists = apiResponse.data;
    //       this.isCheckingEmail = false;
    //     }
    //   },
    //   error: (error) => {
    //     this.notificationService.toastError('Erro ao verificar email');
    //     this.isCheckingEmail = false
    //   },
    //   complete: () => {
    //     if(this.userExists){
    //         this.router.navigate(['/login'], { queryParams: { email: this.authForm.controls['email'].value } });
    //     }
    //     else{
    //         this.router.navigate(['/register'], { queryParams: { email: this.authForm.controls['email'].value } });
    //     }
    //   }
    // });

    this.isCheckingEmail = true;

  }

}
