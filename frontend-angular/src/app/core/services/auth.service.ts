import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly accessTokenKey : string = "accessToken";
  private readonly refreshTokenKey: string = "refreshToken";
  private readonly microserviceKey: string = 'microserviceEndpoint';

  constructor(private _httpClient: HttpClient) { }

  login(email: string, password: string, microservice: boolean = false) {
    const body = { email, password };
    return this._httpClient.post<AuthResponse>(`${environment.bffUrl}/auth/login/${microservice ? 'B' : 'A'}`, body)
              .pipe(
                tap((res) => {
                  localStorage.setItem(this.accessTokenKey , res.accessToken);
                  localStorage.setItem(this.refreshTokenKey, res.refreshToken);
                  localStorage.setItem(this.microserviceKey, microservice ? 'B' : 'A');
                })
              );;
  }

  getMicroserviceEndpoint(): 'A' | 'B' {
    const microservice = localStorage.getItem(this.microserviceKey);
    return microservice === 'B' ? 'B' : 'A';
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

    const endpoint = `${environment.bffUrl}/auth/refresh/${microservice ? 'B' : 'A'}`;
    return this._httpClient.post<AuthResponse>(endpoint, { refreshToken: token }).pipe(
      tap((res) => {
        localStorage.setItem(this.accessTokenKey, res.accessToken);
        localStorage.setItem(this.refreshTokenKey, res.refreshToken);
        localStorage.setItem(this.microserviceKey, microservice ? 'B' : 'A');
      }),
      catchError(() => of(null))
    );
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.microserviceKey);
  }
}
