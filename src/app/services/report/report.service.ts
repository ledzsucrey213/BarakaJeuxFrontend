import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Report } from '../../models/report/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://barakajeuxbackend.cluster-ig4.igpolytech.fr/api/report'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Requête pour récupérer tous les reports
  }

  getReportByEventId(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?event_id=${eventId}`);
  }

  postReport(report: Omit<Report, '_id'>): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/`, report); }

  getReportByEventIdAndSellerId(eventId: string, sellerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/event/${eventId}/seller/${sellerId}`);
  }
  
  updateReport(reportId: string, updatedReport: Partial<Report>): Observable<Report> {
    const url = `${this.apiUrl}/${reportId}`; // URL de la ressource à mettre à jour
    return this.http.put<Report>(url, updatedReport);
  }

}
