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

  // Pour récupérer plusieurs stocks (tableau)
  getStocks(): Observable<Stock[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((data) => data.map((stock) => Stock.createFrom(stock)))
    );
  }

  // Pour récupérer un seul stock par son ID
  getStockById(id: string): Observable<Stock> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((data) => Stock.createFrom(data))
    );
  }

  // Pour récupérer un stock par sellerId
  getStocksByClientId(sellerId: string): Observable<Stock> {
    return this.http.get<any>(`${this.apiUrl}/seller/${sellerId}`).pipe(
      map((data) => Stock.createFrom(data))
    );
  }
}
