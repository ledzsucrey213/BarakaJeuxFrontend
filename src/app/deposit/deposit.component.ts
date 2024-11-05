import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class DepositComponent {
  searchName: string = '';
  price: number | null = null;
  quantity: number | null = null;
  condition: string = 'New';


  addGames() {
  }

  endDeposit() {
  }
}
