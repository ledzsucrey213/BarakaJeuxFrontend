import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice } from '../../models/invoice/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://barakajeuxbackend.cluster-ig4.igpolytech.fr/api/invoice'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les game_labels
  }

  getInvoicesByClientId(clientId: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/buyer/${clientId}`);
  }

  postInvoice(invoice: Omit<Invoice, '_id'>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/`, invoice);
  }

}
