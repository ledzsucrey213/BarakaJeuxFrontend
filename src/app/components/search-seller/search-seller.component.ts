import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-seller',
  templateUrl: './search-seller.component.html',
  styleUrls: ['./search-seller.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class SearchSellerComponent {
  searchTerm: string = '';
  sellers: User[] = []; // Liste des vendeurs trouvés

  constructor(private router: Router, private userService: UserService) {}

  searchSeller() {
    console.log(`Recherche du vendeur avec le terme : ${this.searchTerm}`);

    this.userService.getSellers().subscribe({
      next: (sellers) => {
        // Filtrer les résultats en fonction du terme de recherche
        this.sellers = sellers.filter((seller) =>
          `${seller.firstname} ${seller.name}`.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des vendeurs :', error);
      },
      complete: () => {
        console.log('Recherche des vendeurs terminée.');
      }
    });    
  }

  selectSeller(seller: User) {
    console.log(`Vendeur sélectionné : ${seller.firstname} ${seller.name}`);
    this.router.navigate(['/deposit']);
    // Ajoutez ici la logique pour la sélection du vendeur
  }

  goToNewSellerComponent() {
    this.router.navigate(['/new-seller']);
  }
}
