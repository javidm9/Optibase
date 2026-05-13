import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo } from '../models/articulo';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ArticuloService {
  private apiUrl = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) {}

  getArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.apiUrl);
  }

  createArticulo(articulo: Omit<Articulo, 'id'>): Observable<Articulo> {
    return this.http.post<Articulo>(this.apiUrl, articulo);
  }

  updateArticulo(id: number, articulo: Partial<Articulo>): Observable<Articulo> {
    return this.http.put<Articulo>(`${this.apiUrl}/${id}`, articulo);
  }

  deleteArticulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
