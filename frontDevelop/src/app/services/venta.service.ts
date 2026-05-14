import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';
import { environment } from '../../environments/environment';

// Al crear una venta, el back descuenta stock automáticamente; si el stock es 0 devuelve 400
@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = `${environment.apiUrl}/api/ventas`;

  constructor(private http: HttpClient) {}

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  getVentasByCliente(clienteId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  getVentasPendientes(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/pendientes`);
  }

  createVenta(venta: Omit<Venta, 'id'>): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  updateVenta(id: number, venta: Partial<Venta>): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/${id}`, venta);
  }

  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
