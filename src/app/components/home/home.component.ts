import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToEventComponent() {
    this.router.navigate(['/sale']);
  }

  goToSellerComponent() {
    this.router.navigate(['/search-seller']);
  }

  goToStock() {
    this.router.navigate(['/stock']);
  }

}
