import { Component } from '@angular/core';

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

  constructor() {}

  login() {
    console.log('Microservice:', this.microservice);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
