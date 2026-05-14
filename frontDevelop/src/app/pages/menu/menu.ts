import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.html'
})
export class Menu {

  nombreUsuario: string = '';
  rolUsuario: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.nombreUsuario = this.authService.getNombre() ?? 'Usuario';
    this.rolUsuario    = this.authService.getRol()    ?? '';
  }

  irAClientes()   { this.router.navigate(['/clientes']); }
  irACitas()      { this.router.navigate(['/citas']); }
  irAInventario() { this.router.navigate(['/inventario']); }
  irAVentas()        { this.router.navigate(['/ventas']); }
  irAEncargos()      { this.router.navigate(['/encargos']); }
  irAEstadisticas()  { this.router.navigate(['/estadisticas']); }

  salir() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
