import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected apiUrl = 'http://localhost:3000';
  protected entityUrl = '';

  protected http = inject(HttpClient);

  protected get<T>(endpoint: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.apiUrl+this.entityUrl}/${endpoint}`, { params, headers });
  }

  protected post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.apiUrl+this.entityUrl}/${endpoint}`, body, { headers });
  }

  protected put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.apiUrl+this.entityUrl}/${endpoint}`, body, { headers });
  }

  protected delete<T>(endpoint: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl+this.entityUrl}/${endpoint}`, { params, headers });
  }
}
