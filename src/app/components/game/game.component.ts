import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameLabelService } from '../../services/game_label/game-label.service';
import { GameService } from '../../services/game/game.service';
import { GameLabel } from '../../models/game_label/game-label';
import { Game } from '../../models/game/game';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports : [CommonModule],
  standalone : true
})
export class GameComponent implements OnInit {
  gameLabels: GameLabel[] = [];
  gameId: string = '';
  gameName: string = '';  // Variable pour stocker le nom du jeu
  sellerNames: { [key: string]: string } = {};  // Dictionnaire pour stocker le nom du vendeur par seller_id

  constructor(
    private route: ActivatedRoute,
    private gameLabelService: GameLabelService,
    private gameService: GameService,
    private userService: UserService,
    private cdr: ChangeDetectorRef  // Injecter ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du jeu depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id') || '';
      this.fetchGameDetails(this.gameId);  // Récupérer les détails du jeu
      this.fetchGameLabels(this.gameId);  // Récupérer les GameLabels pour ce jeu
    });
  }

  // Méthode pour récupérer les détails du jeu (nom, etc.)
  fetchGameDetails(gameId: string): void {
    this.gameService.getGameById(gameId).subscribe({
      next: (game: Game) => {
        this.gameName = game.name;  // Stocker le nom du jeu
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du jeu :', error);
      },
    });
  }

  // Méthode pour récupérer le nom complet du vendeur (nom + prénom)
  fetchSellerName(seller_id: string): void {
    console.log(`Fetching seller for seller_id: ${seller_id}`);  // Log pour vérifier si le seller_id est bien passé
    this.userService.getUserById(seller_id).subscribe({
      next: (seller: User) => {
        console.log(`Seller found: ${seller.name} ${seller.firstname}`);  // Vérifiez les données du vendeur
        this.sellerNames[seller_id] = `${seller.name} ${seller.firstname}`;
        this.cdr.detectChanges();  // Assurez-vous que la vue est mise à jour après modification
      },
      error: (error) => {
        console.error(`Erreur lors de la récupération du vendeur avec ID ${seller_id}:`, error);
      },
    });
  }
  

  // Méthode pour récupérer les GameLabels associés au jeu
  fetchGameLabels(gameId: string): void {
    this.gameLabelService.getGameLabelsByGameId(gameId).subscribe({
      next: (data) => {
        // récupérer seulement les jeux en vente
        this.gameLabels = data.filter((gameLabel) => gameLabel.is_On_Sale);

        // Pour chaque GameLabel, récupérer le nom du vendeur et le stocker
        this.gameLabels.forEach((gameLabel) => {
          if (gameLabel.seller_id) {
            console.log(`Fetching seller for gameLabel ID: ${gameLabel._id}, seller_id: ${gameLabel.seller_id}`);
            this.fetchSellerName(gameLabel.seller_id);  // Récupérer le nom du vendeur
          }
          else {console.log(`Fail`)}
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des GameLabels :', error);
      },
      complete: () => {
        console.log('Récupération des GameLabels terminée.');
      },
    });
  }

  // Méthode pour ajouter un GameLabel au panier
  addToCart(gameLabelId: string): void {
    console.log(`Ajout du GameLabel avec ID ${gameLabelId} au panier`);
    // Implémentez la logique pour ajouter au panier ici
  }
}
