// home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', // Assurez-vous que le chemin est correct
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent {
  constructor(private router: Router) {} // Injectez le Router

  goToEventComponent() {
    this.router.navigate(['/event']); // Redirige vers /event
  }
}
