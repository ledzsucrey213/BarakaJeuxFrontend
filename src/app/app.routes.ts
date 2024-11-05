// app.routes.ts
import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Ajustez le chemin si nécessaire
import { EventComponent } from './event/event.component'; // Assurez-vous que le chemin est correct
import { SearchSellerComponent } from './search-seller/search-seller.component';
import { DepositComponent } from './deposit/deposit.component';
import { NewSellerComponent } from './new-seller/new-seller.component';

export const routes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'event', component: EventComponent},
  {path : 'search-seller', component: SearchSellerComponent},
  {path : 'deposit', component : DepositComponent},
  {path : 'new-seller', component : NewSellerComponent},
];
