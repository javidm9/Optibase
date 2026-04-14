import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduacion } from '../models/graduacion';

@Injectable({ providedIn: 'root' })
export class GraduacionService {
  private apiUrl = 'http://localhost:8080/api/graduaciones';

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
