import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cita, EstadoCita } from '../../models/cita';
import { Cliente } from '../../models/cliente';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
})
export class CitasPage implements OnInit {

  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  cargando = false;
  errorCarga: string | null = null;

  // Vista activa
  vistaActual: 'lista' | 'semana' | 'mes' = 'lista';
  fechaReferencia: Date = new Date();

  // Filtros (vista lista)
  filtroCliente = '';
  filtroEstado = '';
  filtroFecha = '';

  // Modal Ver / Editar
  citaSeleccionada: Cita | null = null;
  modoEdicion = false;
  citaEditando: Partial<Cita> = {};
  guardando = false;
  errorModal: string | null = null;

  // Modal Nueva Cita
  mostrarNueva = false;
  nuevaCita: Partial<Cita> = {};
  creando = false;
  errorNueva: string | null = null;

  // Buscador de cliente
  busquedaCliente = '';
  clientesList: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteElegido: Cliente | null = null;

  readonly duraciones = [15, 30, 45, 60, 90];
  readonly estados: EstadoCita[] = ['PENDIENTE', 'COMPLETADA', 'CANCELADA'];
  readonly DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  readonly horasSlots: string[] = Array.from({ length: 24 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
  });

  constructor(
    private citaService: CitaService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCitas();
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientesList = data,
      error: () => {}
    });
  }

  cargarCitas() {
    this.cargando = true;
    this.errorCarga = null;
    this.citaService.getCitas().subscribe({
      next: (data) => {
        this.citas = data.sort((a, b) =>
          (a.fecha + 'T' + a.hora).localeCompare(b.fecha + 'T' + b.hora)
        );
        this.cargando = false;
        this.aplicarFiltros();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica que el backend esté activo en localhost:8080.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros() {
    this.citasFiltradas = this.citas.filter(c => {
      const matchCliente = !this.filtroCliente || (c.clienteNombre ?? '').toLowerCase().includes(this.filtroCliente.toLowerCase());
      const matchEstado  = !this.filtroEstado  || c.estado === this.filtroEstado;
      const matchFecha   = !this.filtroFecha   || c.fecha === this.filtroFecha;
      return matchCliente && matchEstado && matchFecha;
    });
  }

  filtrarHoy() {
    this.filtroFecha = this.dateToStr(new Date());
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtroCliente = '';
    this.filtroEstado = '';
    this.filtroFecha = '';
    this.aplicarFiltros();
  }

  volverAlMenu() { this.router.navigate(['/menu']); }

  // === NAVEGACIÓN CALENDARIO ===
  prevSemana() {
    const d = new Date(this.fechaReferencia);
    d.setDate(d.getDate() - 7);
    this.fechaReferencia = d;
  }

  nextSemana() {
    const d = new Date(this.fechaReferencia);
    d.setDate(d.getDate() + 7);
    this.fechaReferencia = d;
  }

  prevMes() {
    const d = new Date(this.fechaReferencia);
    d.setMonth(d.getMonth() - 1);
    this.fechaReferencia = d;
  }

  nextMes() {
    const d = new Date(this.fechaReferencia);
    d.setMonth(d.getMonth() + 1);
    this.fechaReferencia = d;
  }

  irAHoy() { this.fechaReferencia = new Date(); }

  // === GETTERS CALENDARIO ===
  get diasSemanaActual(): Date[] {
    const ref = new Date(this.fechaReferencia);
    const day = ref.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    ref.setDate(ref.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ref);
      d.setDate(ref.getDate() + i);
      return d;
    });
  }

  get semanasMes(): Date[][] {
    const year = this.fechaReferencia.getFullYear();
    const month = this.fechaReferencia.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    const start = new Date(firstDay);
    const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));

    const weeks: Date[][] = [];
    const cur = new Date(start);

    while (cur <= lastDay || weeks.length < 4) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
      if (cur > lastDay && weeks.length >= 4) break;
    }
    return weeks;
  }

  get tituloSemana(): string {
    const dias = this.diasSemanaActual;
    const ini  = dias[0];
    const fin  = dias[6];
    if (ini.getMonth() === fin.getMonth()) {
      return `${ini.getDate()} – ${fin.getDate()} ${this.MESES[ini.getMonth()]} ${ini.getFullYear()}`;
    }
    return `${ini.getDate()} ${this.MESES[ini.getMonth()]} – ${fin.getDate()} ${this.MESES[fin.getMonth()]} ${fin.getFullYear()}`;
  }

  get tituloMes(): string {
    return `${this.MESES[this.fechaReferencia.getMonth()]} ${this.fechaReferencia.getFullYear()}`;
  }

  dateToStr(d: Date): string {
    const y  = d.getFullYear();
    const m  = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  citasParaDia(d: Date): Cita[] {
    const s = this.dateToStr(d);
    return this.citas.filter(c => c.fecha === s).sort((a, b) => a.hora.localeCompare(b.hora));
  }

  citasParaSlot(d: Date, hora: string): Cita[] {
    const s = this.dateToStr(d);
    return this.citas.filter(c => c.fecha === s && c.hora === hora);
  }

  isToday(d: Date): boolean {
    return this.dateToStr(d) === this.dateToStr(new Date());
  }

  isCurrentMonth(d: Date): boolean {
    return d.getMonth() === this.fechaReferencia.getMonth();
  }

  seleccionarDia(d: Date) {
    this.vistaActual = 'lista';
    this.filtroFecha = this.dateToStr(d);
    this.filtroCliente = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  // === VER / EDITAR CITA ===
  verCita(cita: Cita) {
    this.citaSeleccionada = cita;
    this.modoEdicion = false;
    this.errorModal = null;
  }

  cerrarModal() {
    this.citaSeleccionada = null;
    this.modoEdicion = false;
    this.citaEditando = {};
    this.errorModal = null;
  }

  iniciarEdicion() {
    this.citaEditando = { ...this.citaSeleccionada };
    this.modoEdicion = true;
    this.errorModal = null;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.citaEditando = {};
    this.errorModal = null;
  }

  guardarCambios() {
    if (!this.citaSeleccionada?.id) return;
    this.guardando = true;
    this.errorModal = null;
    this.citaService.updateCita(this.citaSeleccionada.id, this.citaEditando).subscribe({
      next: (actualizada) => {
        const idx = this.citas.findIndex(c => c.id === actualizada.id);
        if (idx !== -1) this.citas[idx] = actualizada;
        this.citaSeleccionada = actualizada;
        this.modoEdicion = false;
        this.guardando = false;
        this.aplicarFiltros();
      },
      error: (err) => {
        this.errorModal = err.status === 409
          ? 'CONFLICTO: Ya existe una cita programada en ese horario.'
          : 'Error al guardar. Intenta de nuevo.';
        this.guardando = false;
      }
    });
  }

  cancelarCita(cita: Cita) {
    if (!cita.id) return;
    if (!confirm(`¿Cancelar la cita de ${cita.clienteNombre} el ${cita.fecha} a las ${cita.hora}?`)) return;
    this.citaService.updateCita(cita.id, { estado: 'CANCELADA' }).subscribe({
      next: (actualizada) => {
        const idx = this.citas.findIndex(c => c.id === actualizada.id);
        if (idx !== -1) this.citas[idx] = actualizada;
        this.citaSeleccionada = actualizada;
        this.modoEdicion = false;
        this.aplicarFiltros();
      },
      error: () => { this.errorModal = 'Error al cancelar. Intenta de nuevo.'; }
    });
  }

  // === NUEVA CITA ===
  abrirNueva() {
    this.nuevaCita = {
      fecha: this.dateToStr(new Date()),
      hora: '09:00',
      duracion: 30,
      motivo: '',
      estado: 'PENDIENTE'
    };
    this.busquedaCliente = '';
    this.clienteElegido = null;
    this.clientesFiltrados = [];
    this.mostrarNueva = true;
    this.errorNueva = null;
  }

  cerrarNueva() {
    this.mostrarNueva = false;
    this.nuevaCita = {};
    this.busquedaCliente = '';
    this.clienteElegido = null;
    this.clientesFiltrados = [];
    this.errorNueva = null;
  }

  onBusquedaCliente() {
    const q = this.busquedaCliente.toLowerCase().trim();
    if (q.length < 2) { this.clientesFiltrados = []; return; }
    this.clientesFiltrados = this.clientesList
      .filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.apellidos.toLowerCase().includes(q) ||
        c.dni.toLowerCase().includes(q)
      ).slice(0, 8);
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteElegido = cliente;
    this.nuevaCita.clienteId = cliente.id;
    this.nuevaCita.clienteNombre = `${cliente.nombre} ${cliente.apellidos}`;
    this.busquedaCliente = `${cliente.nombre} ${cliente.apellidos}`;
    this.clientesFiltrados = [];
  }

  crearCita() {
    if (!this.clienteElegido)              { this.errorNueva = 'Selecciona un cliente.'; return; }
    if (!this.nuevaCita.fecha || !this.nuevaCita.hora) { this.errorNueva = 'Fecha y hora son obligatorias.'; return; }
    if (!this.nuevaCita.motivo?.trim())    { this.errorNueva = 'El motivo es obligatorio.'; return; }
    this.creando = true;
    this.errorNueva = null;
    this.citaService.createCita(this.nuevaCita as Omit<Cita, 'id'>).subscribe({
      next: (creada) => {
        this.citas.push(creada);
        this.citas.sort((a, b) => (a.fecha + 'T' + a.hora).localeCompare(b.fecha + 'T' + b.hora));
        this.cerrarNueva();
        this.creando = false;
        this.aplicarFiltros();
      },
      error: (err) => {
        this.errorNueva = err.status === 409
          ? 'CONFLICTO: Ya existe una cita programada en ese horario.'
          : 'Error al crear la cita. Intenta de nuevo.';
        this.creando = false;
      }
    });
  }

  // === UTILIDADES VISTA ===
  estadoClass(estado: EstadoCita): string {
    switch (estado) {
      case 'PENDIENTE':  return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'COMPLETADA': return 'bg-green-100 text-green-700 border border-green-300';
      case 'CANCELADA':  return 'bg-gray-100 text-gray-400 border border-gray-300';
    }
  }

  citaCardClass(estado: EstadoCita): string {
    switch (estado) {
      case 'PENDIENTE':  return 'border-l-2 border-blue-500 bg-blue-50 text-blue-900 hover:bg-blue-100';
      case 'COMPLETADA': return 'border-l-2 border-green-500 bg-green-50 text-green-900 hover:bg-green-100';
      case 'CANCELADA':  return 'border-l-2 border-gray-300 bg-gray-50 text-gray-400 line-through opacity-60';
    }
  }

  get citasHoy(): number {
    const hoy = this.dateToStr(new Date());
    return this.citas.filter(c => c.fecha === hoy && c.estado === 'PENDIENTE').length;
  }

  get citasPendientes(): number {
    return this.citas.filter(c => c.estado === 'PENDIENTE').length;
  }
}
