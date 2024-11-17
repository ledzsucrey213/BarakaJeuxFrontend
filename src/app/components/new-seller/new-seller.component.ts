import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-new-seller',
  templateUrl: './new-seller.component.html',
  styleUrls: ['./new-seller.component.scss'],
  standalone: true,
  imports: [FormsModule] // Ensure FormsModule is imported
})
export class NewSellerComponent {
  // Define a seller object to bind form fields
  seller = {
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  };

  // This function could be connected to a backend to save the seller data
  createSeller() {
    console.log('New seller created:', this.seller);
    // You can add more logic here to handle form submission (e.g., calling an API)
  }
}
