import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getCitasByCliente(clienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  createCita(cita: Omit<Cita, 'id'>): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  updateCita(id: number, cita: Partial<Cita>): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}`, cita);
  }

  deleteCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
