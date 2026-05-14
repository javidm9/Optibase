import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Menu } from './pages/menu/menu';
import { ClientesList } from './pages/clientes/clientes';
import { CitasPage } from './pages/citas/citas';
import { InventarioPage } from './pages/inventario/inventario';
import { VentasPage } from './pages/ventas/ventas';
import { EncargosPage } from './pages/encargos/encargos';
import { EstadisticasPage } from './pages/estadisticas/estadisticas';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  { path: 'menu',      component: Menu,          canActivate: [authGuard] },
  { path: 'clientes',  component: ClientesList,  canActivate: [authGuard] },
  { path: 'citas',     component: CitasPage,     canActivate: [authGuard] },
  { path: 'inventario',component: InventarioPage, canActivate: [authGuard] },
  { path: 'ventas',    component: VentasPage,    canActivate: [authGuard] },
  { path: 'encargos',     component: EncargosPage,     canActivate: [authGuard] },
  { path: 'estadisticas', component: EstadisticasPage, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
