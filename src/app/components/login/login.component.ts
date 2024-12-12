import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { truncateSync } from 'fs';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone : true
})
export class LoginComponent {

  name: string = '';
  password: string = '';
  
  constructor(private router : Router, private userService : UserService) {}

  login(): void {

    this.userService.login(this.name, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response.message);
        localStorage.setItem('token', response.token); // Stocker le token localement
        this.router.navigate(['/']); // Rediriger après connexion réussie
      },
      error: (error) => {
        console.error('Login failed:', error.error.message);
        alert('Login failed: ' + error.error.message); // Afficher une alerte en cas d'échec
      },
    });
  }

}
