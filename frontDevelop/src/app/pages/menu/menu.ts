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

  readonly nombreUsuario = this.authService.getNombre() ?? 'Usuario';
  readonly rolUsuario    = this.authService.getRol()    ?? '';

  constructor(private router: Router, private authService: AuthService) {}

  irAClientes()   { this.router.navigate(['/clientes']); }
  irACitas()      { this.router.navigate(['/citas']); }
  irAInventario() { this.router.navigate(['/inventario']); }

  salir() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
