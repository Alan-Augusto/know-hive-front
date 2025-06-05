import { Injectable } from '@angular/core';
import { IUser } from '../../entity/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  private readonly USER_KEY = 'loggedUser';
  private readonly TOKEN_KEY = 'authToken';

  setUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): IUser | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) as IUser : null;
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
