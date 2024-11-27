import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import du FormsModule

import { AppComponent } from './app.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AdvancedSearchComponent,
    AppComponent // Ajouter FormsModule ici
  ],
  providers: [],
})
export class AppModule {}
