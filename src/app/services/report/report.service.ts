import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Report } from '../../models/report/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/report'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les reports
  }

  getReportByEventId(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?event_id=${eventId}`);
  }

  getReportByEventIdAndSellerId(eventId: string, sellerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/event/${eventId}/seller/${sellerId}`);
  }
  

}
