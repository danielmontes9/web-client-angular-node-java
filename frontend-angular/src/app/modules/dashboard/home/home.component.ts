import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}


  logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
    alert('You have been logged out');
  }
}
