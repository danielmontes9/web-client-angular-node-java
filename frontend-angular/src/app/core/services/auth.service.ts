import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _httpClient: HttpClient) { }

  login(email: string, password: string, microservice: boolean = false) {
    const body = { email, password };
    return this._httpClient.post('http://localhost:3000/auth/login/' + (microservice == false ? 'A' : 'B'), body);
  }
}
