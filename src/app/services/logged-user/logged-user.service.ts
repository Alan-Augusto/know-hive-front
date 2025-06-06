import { inject, Injectable } from '@angular/core';
import { IUser } from '../../entity/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  private readonly USER_KEY = 'loggedUser';
  private readonly TOKEN_KEY = 'authToken';

  private router = inject(Router);


  setUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): IUser {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) {
      this.logout()
      throw new Error('No user found');
    }
    return JSON.parse(user) as IUser
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(user: IUser, token: string): void {
    this.setUser(user);
    this.setToken(token);
    this.router.navigate(['/']);
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

}
