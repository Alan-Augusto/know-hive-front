import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoggedUserService } from '../../services/logged-user.service';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule],
    providers: [UserService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);
  private router = inject(Router);
  private utils = inject(UtilsService);
  private loggedUser = inject(LoggedUserService);
  
  registerForm!:FormGroup;
  isCheckingLogin: Boolean = false;
  emailParam!: string;
  existsEmail!: boolean;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      confirmemail: [''],
      password: [''],
      confirmpassword: ['']
    });
    
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.emailParam = queryParams['email'];
    console.log(this.emailParam);
    
    if(this.emailParam){
      this.existsEmail = true;
      this.registerForm.controls['email'].setValue(this.emailParam);
      this.registerForm.controls['email'].disable();
    };
  }

  checkEmailMatch(): void {
    const email = this.registerForm.controls['email'].value;
    const confirmEmail = this.registerForm.controls['confirmemail'].value;

    if (email !== confirmEmail) {
      this.registerForm.controls['confirmemail'].setErrors({ emailMismatch: true });
      this.notificationService.toastError('Errado')
      console.log('Email não confere');
    } else {
      this.registerForm.controls['confirmemail'].setErrors(null);
    }
  
  }

  handleRegister() {}
}
