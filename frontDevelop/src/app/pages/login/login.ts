import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  usuario  = '';
  password = '';
  errorMsg = '';
  cargando = false;

  constructor(private router: Router, private authService: AuthService) {}

  entrar() {
    this.errorMsg = '';
    if (!this.usuario.trim() || !this.password.trim()) {
      this.errorMsg = 'Introduce usuario y contraseña.';
      return;
    }
    this.cargando = true;
    // AuthService guarda token + rol + nombre en localStorage y devuelve true/false según éxito
    this.authService.login(this.usuario, this.password).subscribe(ok => {
      this.cargando = false;
      if (ok) {
        this.router.navigate(['/menu']);
      } else {
        this.errorMsg = 'Credenciales incorrectas.';
      }
    });
  }
}
