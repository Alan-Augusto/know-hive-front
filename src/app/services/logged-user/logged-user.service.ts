import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../../entity/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {

  private readonly USER_KEY = 'loggedUser';
  private readonly TOKEN_KEY = 'authToken';

  private router = inject(Router);

  loggedUser = signal<IUser>(this.initializeUser());

  errorUser: IUser = {
    id: 'error',
    name: 'error',
    email: 'error'
  }


  private initializeUser(): IUser {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) as IUser : this.errorUser;
  }

  setUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.loggedUser.set(user);
  }

  getUser(): IUser {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) {
      this.logout();
      throw new Error('No user found');
    }
    const userParse = JSON.parse(user);
    if(!userParse || userParse.id === 'error') {
      this.logout();
      throw new Error('Invalid user data');
    }
    return JSON.parse(user) as IUser;
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
    this.loggedUser.set(this.errorUser);
    this.router.navigate(['/login']);
  }
}
