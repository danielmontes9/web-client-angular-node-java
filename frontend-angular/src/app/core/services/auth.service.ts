import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly accessTokenKey : string = "accessToken";
  private readonly refreshTokenKey: string = "refreshToken";

  constructor(private _httpClient: HttpClient) { }

  login(email: string, password: string, microservice: boolean = false) {
    const body = { email, password };
    return this._httpClient.post<AuthResponse>('http://localhost:3000/auth/login/' + (microservice == false ? 'A' : 'B'), body)
              .pipe(
                tap((res) => {
                  localStorage.setItem(this.accessTokenKey , res.accessToken);
                  localStorage.setItem(this.refreshTokenKey, res.refreshToken);
                })
              );;
  }

  getAccessToken(): string {
    return localStorage.getItem(this.accessTokenKey ) || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.refreshTokenKey) || '';
  }

  refreshToken(microservice: boolean = false) {
    const token = this.getRefreshToken();
    if (!token) return of(null);

    const endpoint = `http://localhost:3000/auth/refresh/${microservice ? 'B' : 'A'}`;
    return this._httpClient.post<any>(endpoint, { refreshToken: token }).pipe(
      tap((res) => {
        localStorage.setItem(this.accessTokenKey, res.accessToken);
        localStorage.setItem(this.refreshTokenKey, res.refreshToken);
      }),
      catchError(() => of(null))
    );
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
