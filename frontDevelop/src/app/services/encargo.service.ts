import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encargo } from '../models/encargo';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EncargoService {
  private apiUrl = `${environment.apiUrl}/api/encargos`;

  constructor(private http: HttpClient) {}

  getEncargos(): Observable<Encargo[]> {
    return this.http.get<Encargo[]>(this.apiUrl);
  }

  getEncargosByCliente(clienteId: number): Observable<Encargo[]> {
    return this.http.get<Encargo[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  getEncargosByTipo(tipo: string): Observable<Encargo[]> {
    return this.http.get<Encargo[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  createEncargo(encargo: Omit<Encargo, 'id'>): Observable<Encargo> {
    return this.http.post<Encargo>(this.apiUrl, encargo);
  }

  updateEncargo(id: number, encargo: Partial<Encargo>): Observable<Encargo> {
    return this.http.put<Encargo>(`${this.apiUrl}/${id}`, encargo);
  }

  deleteEncargo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
