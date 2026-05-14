import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html'
})
export class Menu {

  nombreUsuario: string = '';
  rolUsuario: string = '';
  // Uso esta propiedad para ocultar el botón de Usuarios a los no administradores
  esAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.nombreUsuario = this.authService.getNombre() ?? 'Usuario';
    this.rolUsuario    = this.authService.getRol()    ?? '';
    this.esAdmin       = this.authService.getRol() === 'ROLE_ADMIN';
  }

  irAClientes()   { this.router.navigate(['/clientes']); }
  irACitas()      { this.router.navigate(['/citas']); }
  irAInventario() { this.router.navigate(['/inventario']); }
  irAVentas()        { this.router.navigate(['/ventas']); }
  irAEncargos()      { this.router.navigate(['/encargos']); }
  irAEstadisticas()  { this.router.navigate(['/estadisticas']); }
  irAUsuarios()      { this.router.navigate(['/usuarios']); }

  salir() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
