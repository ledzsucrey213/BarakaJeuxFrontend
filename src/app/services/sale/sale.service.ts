import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sale } from '../../models/sale/sale';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = 'http://barakajeuxbackend.cluster-ig4.igpolytech.fr/api/sale'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les sales
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`).pipe(
      map((json) => Sale.createFrom(json)) // Mapper l'objet JSON au modèle Game
    ); }


  postSale(sale: Omit<Sale, '_id'>): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/`, sale);
  }

  updateSale(saleId: string, updatedSale: Partial<Sale>): Observable<Sale> {
    const url = `${this.apiUrl}/${saleId}`; // URL de la ressource à mettre à jour
    return this.http.put<Sale>(url, updatedSale);
  }
  

}
