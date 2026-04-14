import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En SSR (servidor) no existe localStorage — dejamos pasar y el cliente decide
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('userToken');
  if (token) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};