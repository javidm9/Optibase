import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  rol: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY  = 'userToken';
  private readonly ROL_KEY    = 'userRol';
  private readonly NOMBRE_KEY = 'userNombre';
  private readonly API_URL    = `${environment.apiUrl}/api/auth/login`;
  // isBrowser evita que el código que accede a localStorage rompa en SSR (Node.js no tiene window)
  private readonly isBrowser  = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasenya: string): Observable<boolean> {
    return this.http.post<LoginResponse>(this.API_URL, { nombre: usuario, contrasenya }).pipe(
      tap(res => {
        // Guardo token, rol y nombre para que otros componentes los lean sin volver a llamar al backend
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY,  res.token);
          localStorage.setItem(this.ROL_KEY,    res.rol);
          localStorage.setItem(this.NOMBRE_KEY, res.nombre);
        }
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROL_KEY);
      localStorage.removeItem(this.NOMBRE_KEY);
    }
  }

  isAuthenticated(): boolean {
    return this.isBrowser && !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getRol(): string | null {
    return this.isBrowser ? localStorage.getItem(this.ROL_KEY) : null;
  }

  getNombre(): string | null {
    return this.isBrowser ? localStorage.getItem(this.NOMBRE_KEY) : null;
  }
}
