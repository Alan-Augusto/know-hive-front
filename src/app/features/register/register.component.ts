import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormService } from '../../services/utils/form.service';
import { AuthBaseComponent } from "../../components/auth-base/auth-base.component";
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { AuthService } from '../../services/auth/auth.service';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { IUser } from '../../entity/user.interface';
import { IRegisterAuth } from '../../entity/registerAuth.interface';

@Component({
  selector: 'app-register',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, DividerModule, PasswordModule, AuthBaseComponent, KhButtonComponent],
  providers: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private loggedUserService = inject(LoggedUserService);

  registerForm!: FormGroup;

  isCheckingRegister = signal<boolean>(false);
  emailParam = signal<string | null>(null);
  existsEmail = signal<boolean>(false);

  ngOnInit(): void {
    this.initializeForm();
    this.handleQueryParams();
  }

  private initializeForm() {
    this.registerForm = this.fb.group({
      name: [null, [this.formService.requiredValidator()]],
      email: [null, [this.formService.requiredValidator(), this.formService.emailValidator()]],
      confirmemail: [null, [this.formService.requiredValidator(), this.formService.matchControlValidator('email')]],
      password: [null, [this.formService.requiredValidator(), this.formService.passwordValidator()]],
      confirmpassword: [null, [this.formService.requiredValidator(), this.formService.matchControlValidator('password')]],
    });

    // this.formService.validateFormErrors(this.registerForm);
  }

  private handleQueryParams() {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.emailParam.set(queryParams['email']);
    this.existsEmail.set(!!this.emailParam());

    if (this.existsEmail()) {
      this.registerForm.controls['email'].setValue(this.emailParam());
      this.registerForm.controls['email'].disable();
    }
  }

  handleRegister() {
    if (!this.formService.validateForm(this.registerForm)) {
      this.notificationService.toastError('Verifique os campos do formulário.');
      return;
    }

    this.isCheckingRegister.set(true);

    const formRegister:IRegisterAuth = {
      email: this.registerForm.value.confirmemail,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
    };

    this.authService.register(formRegister).subscribe({
      next: (res: any) => {
        if(res?.token && res?.user) {
          this.loggedUserService.setUser(res.user);
          this.loggedUserService.setToken(res.token);

          this.notificationService.toastSuccess('Cadastro realizado com sucesso!');
          this.router.navigate(['/home']);

        }
        else {
          this.notificationService.toastError('Erro cadastrar usuário. Verifique suas credenciais.');
        }
      },
      error: (error: any) => {
        console.error(error);
        this.isCheckingRegister.set(false);
        this.notificationService.toastError('Erro ao cadastrar usuário. Verifique as informações.');
      },
      complete: () => {
        this.isCheckingRegister.set(false);
      }
    });
  }
}
