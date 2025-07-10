import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Item } from '../models/Item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) { }

  getResource(): Observable<Item> {
    return this._httpClient.get<Item>(`http://localhost:3000/resource/${this._authService.getMicroserviceEndpoint()}`);
  }

}
