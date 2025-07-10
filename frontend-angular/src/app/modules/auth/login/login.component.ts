import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(private _authService: AuthService) {}

  login(): void {
    console.log('Microservice:', this.microservice);
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this._authService.login(this.email, this.password, this.microservice)
      .subscribe(reponse => {
        console.log('Login successful:', reponse);
      });
  }
}
