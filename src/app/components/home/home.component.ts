import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf'; // Importez jsPDF

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

  generatePDF() {
    // Créez une instance de jsPDF
    const doc = new jsPDF();

    // Ajoutez du texte à votre document PDF
    doc.text('Yanis and Jalil', 10, 10); // Le texte sera placé à 10, 10 (position x, y)

    // Téléchargez le PDF avec le nom "Yanis_and_Jalil.pdf"
    doc.save('Yanis_and_Jalil.pdf');
  }
}
