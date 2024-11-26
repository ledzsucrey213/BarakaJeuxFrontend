// app.routes.ts
import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // Ajustez le chemin si nécessaire
import { EventComponent } from './components/event/event.component'; // Assurez-vous que le chemin est correct
import { SearchSellerComponent } from './components/search-seller/search-seller.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { NewSellerComponent } from './components/new-seller/new-seller.component';
import { GameComponent } from './components/game/game.component';
import { SaleComponent } from './components/sale/sale.component';
import { StockComponent } from './components/stock/stock.component';

export const routes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'event', component: EventComponent},
  {path : 'search-seller', component: SearchSellerComponent},
  {path : 'sale', component : SaleComponent},
  {path : 'deposit/:id', component : DepositComponent},
  {path : 'new-seller', component : NewSellerComponent},
  {path : 'game/:id', component : GameComponent},
  {path : 'stock/:id', component : StockComponent},
];
