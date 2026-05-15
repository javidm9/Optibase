import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduacion } from '../models/graduacion';
import { environment } from '../../environments/environment';

// Apunta a /api/historiales, que es el nombre que decidí darle al endpoint de graduaciones en el back
@Injectable({ providedIn: 'root' })
export class GraduacionService {
  private apiUrl = `${environment.apiUrl}/api/historiales`;

  constructor(private http: HttpClient) {}

  getByClienteId(clienteId: number): Observable<Graduacion[]> {
    return this.http.get<Graduacion[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  createGraduacion(graduacion: Omit<Graduacion, 'id'>): Observable<Graduacion> {
    return this.http.post<Graduacion>(this.apiUrl, graduacion);
  }

  updateGraduacion(id: number, graduacion: Partial<Graduacion>): Observable<Graduacion> {
    return this.http.put<Graduacion>(`${this.apiUrl}/${id}`, graduacion);
  }

  deleteGraduacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
