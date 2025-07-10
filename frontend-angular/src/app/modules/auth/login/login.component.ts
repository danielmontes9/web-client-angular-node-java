import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  microservice: boolean = false;
  email: string = '';
  password: string = '';

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}

  login(): void {
    console.log('Microservice:', this.microservice);
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this._authService.login(this.email, this.password, this.microservice)
      .subscribe(reponse => {
        if(reponse && reponse.accessToken) {
          this._router.navigate(['/home']);
          alert('Login successful');
        }
      });
  }
}
