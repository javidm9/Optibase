import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

function jwtExpirado(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' && payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En SSR (servidor) no existe localStorage — dejamos pasar y el cliente decide
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('userToken');
  if (token && !jwtExpirado(token)) {
    return true;
  }

  if (token) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRol');
    localStorage.removeItem('userNombre');
  }
  router.navigate(['/login']);
  return false;
};