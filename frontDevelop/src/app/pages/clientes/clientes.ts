import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { Graduacion } from '../../models/graduacion';
import { ClienteService } from '../../services/cliente.service';
import { GraduacionService } from '../../services/graduacion.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
})
export class ClientesList implements OnInit {

  clientesOriginales: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  paginatedClientes: Cliente[] = [];

  filtros = { nombre: '', apellidos: '', dni: '' };
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  cargando = false;
  errorCarga: string | null = null;

  clienteSeleccionado: Cliente | null = null;
  modoEdicion = false;
  clienteEditando: Partial<Cliente> = {};
  guardando = false;
  errorModal: string | null = null;

  mostrarNuevo = false;
  nuevoCliente: Partial<Cliente> = {};
  creando = false;
  errorNuevo: string | null = null;

  vistaFicha: 'datos' | 'graduaciones' = 'datos';
  graduaciones: Graduacion[] = [];
  cargandoGraduaciones = false;
  mostrarFormGraduacion = false;
  nuevaGraduacion: Partial<Graduacion> = {};
  creandoGraduacion = false;
  errorGraduacion: string | null = null;

  constructor(
    private clienteService: ClienteService,
    private graduacionService: GraduacionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obtenerClientesDeJava();
  }

  obtenerClientesDeJava() {
    this.cargando = true;
    this.errorCarga = null;
    this.clienteService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientesOriginales = data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        this.cargando = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica que el backend esté activo en localhost:8080.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    const searchData = this.clientesOriginales.filter(p =>
      (p.nombre ?? '').toLowerCase().includes(this.filtros.nombre.toLowerCase()) &&
      (p.apellidos ?? '').toLowerCase().includes(this.filtros.apellidos.toLowerCase()) &&
      (p.dni ?? '').toLowerCase().includes(this.filtros.dni.toLowerCase())
    );
    this.totalPages = Math.ceil(searchData.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedClientes = searchData.slice(start, start + this.itemsPerPage);
    this.filteredClientes = searchData;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.applyFilters(); }
  }

  prevPage() {
    if (this.currentPage > 1) { this.currentPage--; this.applyFilters(); }
  }

  volverAlMenu() {
    this.router.navigate(['/menu']);
  }

  verFicha(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modoEdicion = false;
    this.vistaFicha = 'datos';
    this.graduaciones = [];
    this.mostrarFormGraduacion = false;
    this.errorModal = null;
  }

  cerrarFicha() {
    this.clienteSeleccionado = null;
    this.modoEdicion = false;
    this.clienteEditando = {};
    this.vistaFicha = 'datos';
    this.graduaciones = [];
    this.mostrarFormGraduacion = false;
    this.errorModal = null;
  }

  cambiarVista(vista: 'datos' | 'graduaciones') {
    this.vistaFicha = vista;
    this.modoEdicion = false;
    this.errorModal = null;
    if (vista === 'graduaciones' && this.clienteSeleccionado?.id && this.graduaciones.length === 0) {
      this.cargarGraduaciones();
    }
  }

  iniciarEdicion() {
    this.clienteEditando = { ...this.clienteSeleccionado };
    this.modoEdicion = true;
    this.errorModal = null;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.clienteEditando = {};
    this.errorModal = null;
  }

  guardarCambios() {
    if (!this.clienteSeleccionado?.id) return;
    this.guardando = true;
    this.errorModal = null;
    this.clienteService.updateCliente(this.clienteSeleccionado.id, this.clienteEditando).subscribe({
      next: (actualizado: Cliente) => {
        const idx = this.clientesOriginales.findIndex(c => c.id === actualizado.id);
        if (idx !== -1) this.clientesOriginales[idx] = actualizado;
        this.clienteSeleccionado = actualizado;
        this.modoEdicion = false;
        this.guardando = false;
        this.applyFilters();
      },
      error: () => {
        this.errorModal = 'Error al guardar. Intenta de nuevo.';
        this.guardando = false;
      }
    });
  }

  eliminarCliente(cliente: Cliente) {
    if (!cliente.id) return;
    if (!confirm(`¿Eliminar a ${cliente.nombre} ${cliente.apellidos}? Esta acción no se puede deshacer.`)) return;
    this.clienteService.deleteCliente(cliente.id).subscribe({
      next: () => {
        this.clientesOriginales = this.clientesOriginales.filter(c => c.id !== cliente.id);
        this.cerrarFicha();
        this.applyFilters();
      },
      error: () => { this.errorModal = 'Error al eliminar. Intenta de nuevo.'; }
    });
  }

  cargarGraduaciones() {
    if (!this.clienteSeleccionado?.id) return;
    this.cargandoGraduaciones = true;
    this.graduacionService.getByClienteId(this.clienteSeleccionado.id).subscribe({
      next: (data: Graduacion[]) => {
        this.graduaciones = data.sort((a, b) => (b.fechaRevision ?? '').localeCompare(a.fechaRevision ?? ''));
        this.cargandoGraduaciones = false;
      },
      error: () => { this.cargandoGraduaciones = false; }
    });
  }

  abrirFormGraduacion() {
    this.nuevaGraduacion = {
      cliente: { id: this.clienteSeleccionado?.id as number },
      fechaRevision: new Date().toISOString().split('T')[0],
      odEsfera: 0, odCilindro: 0, odEje: 0, odAdicion: undefined,
      oiEsfera: 0, oiCilindro: 0, oiEje: 0, oiAdicion: undefined,
      observaciones: ''
    };
    this.mostrarFormGraduacion = true;
    this.errorGraduacion = null;
  }

  cancelarFormGraduacion() {
    this.mostrarFormGraduacion = false;
    this.nuevaGraduacion = {};
    this.errorGraduacion = null;
  }

  guardarGraduacion() {
    if (!this.nuevaGraduacion.fechaRevision) { this.errorGraduacion = 'La fecha es obligatoria.'; return; }
    this.creandoGraduacion = true;
    this.errorGraduacion = null;
    this.graduacionService.createGraduacion(this.nuevaGraduacion as Omit<Graduacion, 'id'>).subscribe({
      next: (creada: Graduacion) => {
        this.graduaciones.unshift(creada);
        this.cancelarFormGraduacion();
        this.creandoGraduacion = false;
      },
      error: () => {
        this.errorGraduacion = 'Error al guardar la graduación. Intenta de nuevo.';
        this.creandoGraduacion = false;
      }
    });
  }

  eliminarGraduacion(grad: Graduacion) {
    if (!grad.id) return;
    if (!confirm('¿Eliminar esta graduación del historial?')) return;
    this.graduacionService.deleteGraduacion(grad.id).subscribe({
      next: () => { this.graduaciones = this.graduaciones.filter(g => g.id !== grad.id); },
      error: () => {}
    });
  }

  abrirNuevo() {
    this.nuevoCliente = {
      nombre: '', apellidos: '', dni: '', telefono: '',
      direccion: '', edad: '', fechaNacimiento: '',
      localidad: '', provincia: '', codigoPostal: '',
      fechaIngreso: new Date().toISOString().split('T')[0]
    };
    this.mostrarNuevo = true;
    this.errorNuevo = null;
  }

  cerrarNuevo() {
    this.mostrarNuevo = false;
    this.nuevoCliente = {};
    this.errorNuevo = null;
  }

  crearCliente() {
    const { nombre, apellidos, dni } = this.nuevoCliente;
    if (!nombre?.trim() || !apellidos?.trim() || !dni?.trim()) {
      this.errorNuevo = 'Nombre, apellidos y DNI son obligatorios.';
      return;
    }
    this.creando = true;
    this.errorNuevo = null;
    this.clienteService.createCliente(this.nuevoCliente as Omit<Cliente, 'id'>).subscribe({
      next: (creado: Cliente) => {
        this.clientesOriginales.unshift(creado);
        this.cerrarNuevo();
        this.creando = false;
        this.applyFilters();
      },
      error: () => {
        this.errorNuevo = 'Error al crear el cliente. Intenta de nuevo.';
        this.creando = false;
      }
    });
  }
}