import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from '../../models/stock/stock';

@Injectable({
  providedIn: 'root',
})
export class stockService {
  private apiUrl = 'http://localhost:3000/api/stock'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getStocks(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les game_labels
  }

  getStocksByClientId(sellerId: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/seller/${sellerId}`);
  }
}
