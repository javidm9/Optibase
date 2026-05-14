import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  // El backend expone /api/usuarios con acceso restringido a ROLE_ADMIN
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  createUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    // La contraseña viaja en texto plano; el back la hashea con BCrypt en UsuarioService.guardarUsuario()
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
