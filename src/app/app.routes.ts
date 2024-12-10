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
import { AdminComponent } from './components/admin/admin.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { FinancialReportComponent } from './components/financial-report/financial-report.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Route[] = [
  {path: '', component: HomeComponent, data: { title: 'Accueil' }},
  {path: 'event', component: EventComponent, data: { title: 'Evènement' }},
  {path : 'search-seller', component: SearchSellerComponent, data: { title: 'Rechercher un vendeur' }},
  {path : 'sale', component : SaleComponent, data: { title: 'Vente' }},
  {path : 'deposit/:id', component : DepositComponent, data: { title: 'Dépôt' }},
  {path : 'new-seller', component : NewSellerComponent, data: { title: 'Nouveau vendeur' }},
  {path : 'game/:id', component : GameComponent, data: { title: 'Jeux' }},
  {path : 'stock/:id', component : StockComponent, data: { title: 'Stock' }},
  {path : 'advancedsearch', component : AdvancedSearchComponent, data: { title: 'Recherche avancée' }},
  {path : 'financialreport/:id', component : FinancialReportComponent, data: { title: 'Bilan Financier' }},
  {path : 'admin', component : AdminComponent, data: { title: 'Admin' }},
  {path : 'invoice/:id', component : InvoiceComponent, data: { title: 'Factures' }},
  {path : 'login', component : LoginComponent, data: { title: 'Connexion' }}

];
