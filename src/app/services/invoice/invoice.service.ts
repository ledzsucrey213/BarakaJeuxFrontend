import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice } from '../../models/invoice/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/api/invoice'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les game_labels
  }

  getInvoicesByClientId(clientId: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/buyer/${clientId}`);
  }
}
