import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { Item } from '../../../core/models/Item.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  item: Item | null = null;

  constructor(
    private _authService: AuthService,
    private _resourceService: ResourceService,
    private _router: Router
  ) {}


  logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
    alert('You have been logged out');
  }

  getResource(): void {
    this._resourceService.getResource().subscribe({
      next: (response) => {
        this.item = response;
        alert('Resource fetched successfully');
      },
      error: (error) => {
        console.error('Error fetching resource:', error);
        alert('Failed to fetch resource');
      }
    });
  }
}
