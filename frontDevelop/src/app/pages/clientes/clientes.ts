import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { Graduacion } from '../../models/graduacion';
import { Cita, EstadoCita } from '../../models/cita';
import { Venta } from '../../models/venta';
import { ClienteService } from '../../services/cliente.service';
import { GraduacionService } from '../../services/graduacion.service';
import { CitaService } from '../../services/cita.service';
import { VentaService } from '../../services/venta.service';
import { AuthService } from '../../services/auth.service';

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

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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

  vistaFicha: 'datos' | 'graduaciones' | 'citas' | 'ventas' = 'datos';
  graduaciones: Graduacion[] = [];
  cargandoGraduaciones = false;
  mostrarFormGraduacion = false;
  nuevaGraduacion: Graduacion = {} as Graduacion;
  creandoGraduacion = false;
  errorGraduacion: string | null = null;

  graduacionEditando: Graduacion | null = null;
  mostrarFormEdicionGraduacion = false;

  citasCliente: Cita[] = [];
  cargandoCitas = false;
  ventasCliente: Venta[] = [];
  cargandoVentas = false;

  esAdmin = false;

  constructor(
    private clienteService: ClienteService,
    private graduacionService: GraduacionService,
    private citaService: CitaService,
    private ventaService: VentaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.esAdmin = this.authService.getRol() === 'ROLE_ADMIN';
  }

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
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica la conexión.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters() {
    const filtered = this.clientesOriginales.filter(
      (p) =>
        (p.nombre ?? '').toLowerCase().includes(this.filtros.nombre.toLowerCase()) &&
        (p.apellidos ?? '').toLowerCase().includes(this.filtros.apellidos.toLowerCase()) &&
        (p.dni ?? '').toLowerCase().includes(this.filtros.dni.toLowerCase()),
    );
    const sorted = this.applySorting(filtered);
    this.totalPages = Math.ceil(sorted.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedClientes = sorted.slice(start, start + this.itemsPerPage);
    this.filteredClientes = sorted;
  }

  sortBy(column: string) {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.currentPage = 1;
    this.applyFilters();
  }

  sortIcon(col: string): string {
    if (this.sortColumn !== col) return '⇅';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  private applySorting(data: Cliente[]): Cliente[] {
    if (!this.sortColumn) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      switch (this.sortColumn) {
        case 'nombre':          cmp = `${a.nombre} ${a.apellidos}`.localeCompare(`${b.nombre} ${b.apellidos}`); break;
        case 'dni':             cmp = (a.dni ?? '').localeCompare(b.dni ?? ''); break;
        case 'fechaNacimiento': cmp = (a.fechaNacimiento ?? '').localeCompare(b.fechaNacimiento ?? ''); break;
        case 'localidad':       cmp = (a.localidad ?? '').localeCompare(b.localidad ?? ''); break;
      }
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  volverAlMenu() {
    this.router.navigate(['/menu']);
  }

  irACitas() {
    this.router.navigate(['/citas']);
  }

  verFicha(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modoEdicion = false;
    this.vistaFicha = 'datos';
    this.graduaciones = [];
    this.mostrarFormGraduacion = false;
    this.errorModal = null;
    this.citasCliente = [];
    this.ventasCliente = [];
  }

  cerrarFicha() {
    this.clienteSeleccionado = null;
    this.modoEdicion = false;
    this.clienteEditando = {};
    this.vistaFicha = 'datos';
    this.graduaciones = [];
    this.mostrarFormGraduacion = false;
    this.errorModal = null;
    this.citasCliente = [];
    this.ventasCliente = [];
  }

  cambiarVista(vista: 'datos' | 'graduaciones' | 'citas' | 'ventas') {
    this.vistaFicha = vista;
    this.modoEdicion = false;
    this.errorModal = null;
    if (vista === 'graduaciones' && this.clienteSeleccionado?.id && this.graduaciones.length === 0) {
      this.cargarGraduaciones();
    }
    if (vista === 'citas' && this.clienteSeleccionado?.id && this.citasCliente.length === 0) {
      this.cargarCitasCliente();
    }
    if (vista === 'ventas' && this.clienteSeleccionado?.id && this.ventasCliente.length === 0) {
      this.cargarVentasCliente();
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
        const idx = this.clientesOriginales.findIndex((c) => c.id === actualizado.id);
        if (idx !== -1) this.clientesOriginales[idx] = actualizado;
        this.clienteSeleccionado = actualizado;
        this.modoEdicion = false;
        this.guardando = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorModal = 'Error al guardar. Intenta de nuevo.';
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarCliente(cliente: Cliente) {
    if (!cliente.id) return;
    if (
      !confirm(
        `¿Eliminar a ${cliente.nombre} ${cliente.apellidos}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    this.clienteService.deleteCliente(cliente.id).subscribe({
      next: () => {
        this.clientesOriginales = this.clientesOriginales.filter((c) => c.id !== cliente.id);
        this.cerrarFicha();
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorModal = 'Error al eliminar. Intenta de nuevo.';
        this.cdr.detectChanges();
      },
    });
  }

  cargarGraduaciones() {
    if (!this.clienteSeleccionado?.id) return;
    this.cargandoGraduaciones = true;
    this.graduacionService.getByClienteId(this.clienteSeleccionado.id).subscribe({
      next: (data: Graduacion[]) => {
        this.graduaciones = data.sort((a, b) =>
          (b.fechaRevision ?? '').localeCompare(a.fechaRevision ?? ''),
        );
        this.cargandoGraduaciones = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoGraduaciones = false;
      },
    });
  }

  abrirFormGraduacion() {
    this.nuevaGraduacion = {
      cliente: { id: this.clienteSeleccionado?.id as number },
      fechaRevision: new Date().toISOString().split('T')[0],
      odEsfera: 0,
      odCilindro: 0,
      odEje: 0,
      odAdicion: undefined,
      avOd: undefined,
      oiEsfera: 0,
      oiCilindro: 0,
      oiEje: 0,
      oiAdicion: undefined,
      avOi: undefined,
      dip: undefined,
      observaciones: '',
    };
    this.mostrarFormGraduacion = true;
    this.errorGraduacion = null;
  }

  cancelarFormGraduacion() {
    this.mostrarFormGraduacion = false;
    this.nuevaGraduacion = {} as Graduacion;
    this.errorGraduacion = null;
  }

  guardarGraduacion() {
    if (!this.nuevaGraduacion.fechaRevision) {
      this.errorGraduacion = 'La fecha es obligatoria.';
      return;
    }
    this.creandoGraduacion = true;
    this.errorGraduacion = null;
    this.graduacionService
      .createGraduacion(this.nuevaGraduacion as Omit<Graduacion, 'id'>)
      .subscribe({
        next: (creada: Graduacion) => {
          this.graduaciones.unshift(creada);
          this.cancelarFormGraduacion();
          this.creandoGraduacion = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorGraduacion = 'Error al guardar la graduación. Intenta de nuevo.';
          this.creandoGraduacion = false;
          this.cdr.detectChanges();
        },
      });
  }

  eliminarGraduacion(grad: Graduacion) {
    if (!grad.id) return;
    if (!confirm('¿Eliminar esta graduación del historial?')) return;
    this.graduacionService.deleteGraduacion(grad.id).subscribe({
      next: () => {
        this.graduaciones = this.graduaciones.filter((g) => g.id !== grad.id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  abrirEdicionGraduacion(g: Graduacion) {
    this.graduacionEditando = { ...g };
    this.mostrarFormEdicionGraduacion = true;
    this.errorGraduacion = null;
  }

  cancelarEdicionGraduacion() {
    this.graduacionEditando = null;
    this.mostrarFormEdicionGraduacion = false;
    this.errorGraduacion = null;
  }

  guardarEdicionGraduacion() {
    if (!this.graduacionEditando?.id) return;
    if (!this.graduacionEditando.fechaRevision) {
      this.errorGraduacion = 'La fecha es obligatoria.';
      return;
    }
    this.creandoGraduacion = true;
    this.errorGraduacion = null;
    this.graduacionService.updateGraduacion(this.graduacionEditando.id, this.graduacionEditando).subscribe({
      next: (actualizada: Graduacion) => {
        const idx = this.graduaciones.findIndex((g) => g.id === actualizada.id);
        if (idx !== -1) this.graduaciones[idx] = actualizada;
        this.cancelarEdicionGraduacion();
        this.creandoGraduacion = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorGraduacion = 'Error al guardar la graduación. Intenta de nuevo.';
        this.creandoGraduacion = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarCitasCliente() {
    if (!this.clienteSeleccionado?.id) return;
    this.cargandoCitas = true;
    this.citaService.getCitasByCliente(this.clienteSeleccionado.id).subscribe({
      next: (data: Cita[]) => {
        this.citasCliente = data.sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
        this.cargandoCitas = false;
        this.cdr.detectChanges();
      },
      error: () => { this.cargandoCitas = false; },
    });
  }

  cargarVentasCliente() {
    if (!this.clienteSeleccionado?.id) return;
    this.cargandoVentas = true;
    this.ventaService.getVentasByCliente(this.clienteSeleccionado.id).subscribe({
      next: (data: Venta[]) => {
        this.ventasCliente = data.sort((a, b) => b.fechaVenta.localeCompare(a.fechaVenta));
        this.cargandoVentas = false;
        this.cdr.detectChanges();
      },
      error: () => { this.cargandoVentas = false; },
    });
  }

  fechaCitaFicha(c: Cita): string {
    return c.fechaHora ? c.fechaHora.split('T')[0] : '';
  }

  horaCitaFicha(c: Cita): string {
    return c.fechaHora ? (c.fechaHora.split('T')[1] ?? '').substring(0, 5) : '';
  }

  estadoCitaClass(estado: EstadoCita): string {
    switch (estado) {
      case 'PENDIENTE':  return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'COMPLETADA': return 'bg-green-100 text-green-700 border border-green-300';
      case 'CANCELADA':  return 'bg-gray-100 text-gray-400 border border-gray-300';
    }
  }

  fechaVentaFicha(v: Venta): string {
    return v.fechaVenta ? v.fechaVenta.split('T')[0] : '';
  }

  abrirNuevo() {
    this.nuevoCliente = {
      nombre: '',
      apellidos: '',
      dni: '',
      telefono: '',
      direccion: '',
      edad: '',
      fechaNacimiento: '',
      localidad: '',
      provincia: '',
      codigoPostal: '',
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorNuevo = 'Error al crear el cliente. Intenta de nuevo.';
        this.creando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
