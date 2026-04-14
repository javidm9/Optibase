import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'userToken';
  private readonly API_URL   = 'http://localhost:8080/api/auth/login';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasenya: string): Observable<boolean> {
    return this.http.post<LoginResponse>(this.API_URL, { nombre: usuario, contrasenya }).pipe(
      tap(res => { if (this.isBrowser) localStorage.setItem(this.TOKEN_KEY, res.token); }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    if (this.isBrowser) localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.isBrowser && !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }
}
