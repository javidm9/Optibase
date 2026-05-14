import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

// Este módulo es exclusivo de administradores. Si el rol no es ROLE_ADMIN,
// redirigimos al menú directamente desde el constructor para evitar que un
// usuario normal acceda aunque conozca la URL.
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
})
export class UsuariosPage implements OnInit {

  // siempre true porque solo admins llegan aquí
  esAdmin = true;

  usuariosOriginales: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];

  filtroNombre = '';
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 1;

  cargando = false;
  errorCarga: string | null = null;

  // Modal ficha / edición
  usuarioSeleccionado: Usuario | null = null;
  modoEdicion = false;
  usuarioEditando: Partial<Usuario & { nuevaContrasena?: string }> = {};
  guardando = false;
  errorModal: string | null = null;

  // Modal nuevo usuario
  mostrarNuevo = false;
  nuevoUsuario: Partial<Usuario & { contrasenya: string }> = {};
  creando = false;
  errorNuevo: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    // Si alguien sin ROLE_ADMIN llega aquí (p.ej. por URL directa), lo mandamos al menú
    if (this.authService.getRol() !== 'ROLE_ADMIN') {
      this.router.navigate(['/menu']);
    }
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.errorCarga = null;
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuariosOriginales = data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        this.cargando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica la conexión.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aplicarFiltros() {
    const filtrados = this.usuariosOriginales.filter(u =>
      (u.nombre ?? '').toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
    this.totalPages = Math.ceil(filtrados.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.usuariosPaginados = filtrados.slice(start, start + this.itemsPerPage);
    this.usuariosFiltrados = filtrados;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.aplicarFiltros(); }
  }

  prevPage() {
    if (this.currentPage > 1) { this.currentPage--; this.aplicarFiltros(); }
  }

  volverAlMenu() {
    this.router.navigate(['/menu']);
  }

  // Abre la ficha en modo lectura
  verFicha(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modoEdicion = false;
    this.errorModal = null;
    this.usuarioEditando = {};
  }

  cerrarFicha() {
    this.usuarioSeleccionado = null;
    this.modoEdicion = false;
    this.usuarioEditando = {};
    this.errorModal = null;
  }

  iniciarEdicion() {
    // Copiamos los datos del usuario seleccionado al objeto de edición.
    // contrasenya no viene del back (@JsonIgnore), así que el admin debe
    // introducir una nueva si quiere cambiarla; si la deja en blanco no se envía.
    this.usuarioEditando = {
      nombre: this.usuarioSeleccionado?.nombre ?? '',
      rol: this.usuarioSeleccionado?.rol ?? 'ROLE_USER',
      nuevaContrasena: '',
    };
    this.modoEdicion = true;
    this.errorModal = null;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.usuarioEditando = {};
    this.errorModal = null;
  }

  guardarCambios() {
    if (!this.usuarioSeleccionado?.id) return;
    if (!this.usuarioEditando.nombre?.trim()) {
      this.errorModal = 'El nombre de usuario es obligatorio.';
      return;
    }
    this.guardando = true;
    this.errorModal = null;

    const payload: Partial<Usuario> = {
      nombre: this.usuarioEditando.nombre,
      rol: this.usuarioEditando.rol,
    };
    // Solo incluyo la contraseña si el admin ha rellenado el campo
    if (this.usuarioEditando.nuevaContrasena?.trim()) {
      payload.contrasenya = this.usuarioEditando.nuevaContrasena;
    }

    this.usuarioService.updateUsuario(this.usuarioSeleccionado.id, payload).subscribe({
      next: (actualizado: Usuario) => {
        const idx = this.usuariosOriginales.findIndex(u => u.id === actualizado.id);
        if (idx !== -1) this.usuariosOriginales[idx] = actualizado;
        this.usuarioSeleccionado = actualizado;
        this.modoEdicion = false;
        this.guardando = false;
        this.aplicarFiltros();
      },
      error: () => {
        this.errorModal = 'Error al guardar. Intenta de nuevo.';
        this.guardando = false;
      },
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (!usuario.id) return;
    if (!confirm(`¿Eliminar el usuario "${usuario.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.usuarioService.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.usuariosOriginales = this.usuariosOriginales.filter(u => u.id !== usuario.id);
        this.cerrarFicha();
        this.aplicarFiltros();
      },
      error: () => {
        this.errorModal = 'Error al eliminar. Intenta de nuevo.';
      },
    });
  }

  abrirNuevo() {
    this.nuevoUsuario = { nombre: '', contrasenya: '', rol: 'ROLE_USER' };
    this.mostrarNuevo = true;
    this.errorNuevo = null;
  }

  cerrarNuevo() {
    this.mostrarNuevo = false;
    this.nuevoUsuario = {};
    this.errorNuevo = null;
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre?.trim()) {
      this.errorNuevo = 'El nombre de usuario es obligatorio.';
      return;
    }
    if (!this.nuevoUsuario.contrasenya?.trim()) {
      this.errorNuevo = 'La contraseña es obligatoria.';
      return;
    }
    this.creando = true;
    this.errorNuevo = null;

    const payload: Omit<Usuario, 'id'> = {
      nombre: this.nuevoUsuario.nombre!,
      contrasenya: this.nuevoUsuario.contrasenya,
      rol: this.nuevoUsuario.rol ?? 'ROLE_USER',
    };

    this.usuarioService.createUsuario(payload).subscribe({
      next: (creado: Usuario) => {
        this.usuariosOriginales.push(creado);
        this.cerrarNuevo();
        this.creando = false;
        this.aplicarFiltros();
      },
      error: () => {
        this.errorNuevo = 'Error al crear el usuario. Intenta de nuevo.';
        this.creando = false;
      },
    });
  }

  rolLabel(rol: string): string {
    return rol === 'ROLE_ADMIN' ? 'ADMIN' : 'USUARIO';
  }
}
