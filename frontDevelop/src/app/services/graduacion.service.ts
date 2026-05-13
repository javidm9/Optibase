import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduacion } from '../models/graduacion';
import { environment } from '../../environments/environment';

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

  deleteGraduacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
