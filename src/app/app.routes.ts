// app.routes.ts
import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Ajustez le chemin si nécessaire
import { EventComponent } from './event/event.component'; // Assurez-vous que le chemin est correct

export const routes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'event', component: EventComponent}
];
