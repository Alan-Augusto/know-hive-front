import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  validateFormErrors(form: FormGroup): void {
    form.valueChanges.subscribe(() => {
      this._handleErrors(form);
    });
    this._handleRequired(form);
  }

  private _handleRequired(form: FormGroup): void {
    // throw new Error('Method not implemented.');x'
  }

  private _handleErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control) {
        const field = document.querySelector(`[formControlName="${key}"]`);
        if (!field) return;

        if (control.errors && control.dirty) {
          // Mostrar erro
          this.inserirMensagemErro(key, control, field);

        } else {
          // Remover erro
          const existingErrorMessage = document.querySelector(`.error-message[data-for="${key}"]`);
          if (existingErrorMessage) {
            existingErrorMessage.remove();
          }
        }
      }
    });
  }

  private inserirMensagemErro(key: string, control: AbstractControl, field: Element): void {
    if (!document.querySelector(`.error-message[data-for="${key}"]`)) {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.setAttribute('data-for', key);
      errorMessage.innerText = control.errors?.['message'] || 'Campo inválido';
      errorMessage.style.position = 'absolute';
      errorMessage.style.top = `${field?.getBoundingClientRect().bottom + window.scrollY}px`;
      errorMessage.style.left = `${field?.getBoundingClientRect().left}px`;
      errorMessage.style.color = 'red';
      errorMessage.style.fontSize = '0.8rem';
      errorMessage.style.opacity = '.8';
      document.body.appendChild(errorMessage);
    }
  }

  public validateForm(form: FormGroup): boolean {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (!control) return;
      const field = document.querySelector(`[formControlName="${key}"]`);
      if (!field) return;
      if(control.errors){
        this.inserirMensagemErro(key, control, field);
        control.markAsDirty();
        control.updateValueAndValidity();
      }
      else{
        const existingErrorMessage = document.querySelector(`.error-message[data-for="${key}"]`);
        if (existingErrorMessage) {
          existingErrorMessage.remove();
        }
      }

    });
    return form.valid;
  }


  // ============================================
  // ============== FORM VALIDATORS =============
  // ============================================
  public matchControlValidator(controlNameToMatch: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const controlToMatch = control.parent.get(controlNameToMatch);

      if (!controlToMatch) {
        console.warn(`Control with name '${controlNameToMatch}' not found in the parent group.`);
        return null; // If the control to match is not found, do nothing
      }

      const isMatching = control.value === controlToMatch.value;

      return isMatching ? null : { message: 'Valor não corresponde.' };
    };
  }

  public requiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const isValid = control.value && control.value.trim() !== '';
      return isValid ? null : { message: 'Campo obrigatório.' };
    };
  }

  public emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value);
      return isValid ? null : { message: 'Email inválido.' };
    };
  }

  public passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(control.value);
      return isValid ? null : { message: 'Mínimo 8 caracteres, 1 letra e 1 número.' };
    };
  }
}
