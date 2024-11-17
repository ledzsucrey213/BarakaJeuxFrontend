import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-seller',
  templateUrl: './search-seller.component.html',
  styleUrls: ['./search-seller.component.scss'],
  standalone: true,
  imports : [FormsModule]
})
export class SearchSellerComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  searchSeller() {
    console.log(`Recherche du vendeur avec le terme : ${this.searchTerm}`);
    // requete 
  }

  goToDepositComponent() {
    this.router.navigate(['/deposit']); // Redirige vers /event
  }

  goToNewSellerComponent() {
    this.router.navigate(['/new-seller']); // Redirige vers /event
  }
  
}
