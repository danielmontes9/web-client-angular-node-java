import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Item } from '../models/Item.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) { }

  getResource(): Observable<Item> {
    return this._httpClient.get<Item>(`${environment.bffUrl}/resource/${this._authService.getMicroserviceEndpoint()}`);
  }

}
