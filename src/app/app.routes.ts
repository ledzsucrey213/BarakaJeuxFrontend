import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // Ajustez le chemin si nécessaire
import { EventComponent } from './components/event/event.component';
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
import { AuthGuard } from './guard/auth.guard';

export const routes: Route[] = [

  // Routes publiques (non protégées)
  { path: 'login', component: LoginComponent, data: { title: 'Connexion' } },

  // Routes protégées (requièrent authentification)
  { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { title: 'Accueil' } },
  { path: 'event', component: EventComponent, canActivate: [AuthGuard], data: { title: 'Evènement' } },
  { path: 'search-seller', component: SearchSellerComponent, canActivate: [AuthGuard], data: { title: 'Rechercher un vendeur' } },
  { path: 'sale', component: SaleComponent, canActivate: [AuthGuard], data: { title: 'Vente' } },
  { path: 'deposit/:id', component: DepositComponent, canActivate: [AuthGuard], data: { title: 'Dépôt' } },
  { path: 'new-seller', component: NewSellerComponent, canActivate: [AuthGuard], data: { title: 'Nouveau vendeur' } },
  { path: 'game/:id', component: GameComponent, canActivate: [AuthGuard], data: { title: 'Jeux' } },
  { path: 'stock/:id', component: StockComponent, canActivate: [AuthGuard], data: { title: 'Stock' } },
  { path: 'advancedsearch', component: AdvancedSearchComponent, canActivate: [AuthGuard], data: { title: 'Recherche avancée' } },
  { path: 'financialreport/:id', component: FinancialReportComponent, canActivate: [AuthGuard], data: { title: 'Bilan Financier' } },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { title: 'Admin' } },
  { path: 'invoice/:id', component: InvoiceComponent, canActivate: [AuthGuard], data: { title: 'Factures' } },

  // Redirection par défaut vers la page d'accueil
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
