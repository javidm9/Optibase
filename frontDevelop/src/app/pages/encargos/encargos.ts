import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Encargo } from '../../models/encargo';
import { Cliente } from '../../models/cliente';
import { Articulo } from '../../models/articulo';
import { EncargoService } from '../../services/encargo.service';
import { ClienteService } from '../../services/cliente.service';
import { ArticuloService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-encargos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encargos.html',
})
export class EncargosPage implements OnInit {
  encargos: Encargo[] = [];
  encargosFiltrados: Encargo[] = [];
  encargosPaginados: Encargo[] = [];

  cargando = false;
  errorCarga: string | null = null;

  filtroCliente = '';
  filtroEstado = '';

  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  esAdmin = false;

  // Modal Nuevo Encargo
  mostrarNuevo = false;
  clientesLista: Cliente[] = [];
  articulosLista: Articulo[] = [];
  nuevoEncargo: {
    clienteId: number | null;
    productoId: number | null;
    fechaEncargo: string;
    fechaEntregaPrevista: string;
    tipoEncargo: string;
    estado: string;
    proveedor: string;
    numeroPedidoFabrica: string;
    observaciones: string;
  } = {
    clienteId: null, productoId: null,
    fechaEncargo: '', fechaEntregaPrevista: '',
    tipoEncargo: 'MONTURA', estado: 'PENDIENTE',
    proveedor: '', numeroPedidoFabrica: '', observaciones: ''
  };
  creando = false;
  errorNuevo: string | null = null;
  readonly tiposEncargo = ['MONTURA', 'LENTE', 'GAFA_SOL', 'LIQUIDO', 'OTRO'];

  sortBy(column: string) {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.currentPage = 1;
    this.aplicarFiltros();
  }

  sortIcon(col: string): string {
    if (this.sortColumn !== col) return '⇅';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  private applySorting(data: Encargo[]): Encargo[] {
    if (!this.sortColumn) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      switch (this.sortColumn) {
        case 'fechaEncargo':         cmp = a.fechaEncargo.localeCompare(b.fechaEncargo); break;
        case 'fechaEntregaPrevista': cmp = (a.fechaEntregaPrevista ?? '').localeCompare(b.fechaEntregaPrevista ?? ''); break;
        case 'estado':               cmp = a.estado.localeCompare(b.estado); break;
        case 'proveedor':            cmp = (a.proveedor ?? '').localeCompare(b.proveedor ?? ''); break;
      }
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
  }

  readonly estados = ['PENDIENTE', 'EN_PROCESO', 'LISTO', 'ENTREGADO', 'CANCELADO'];

  constructor(
    private encargoService: EncargoService,
    private clienteService: ClienteService,
    private articuloService: ArticuloService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.esAdmin = this.authService.getRol() === 'ROLE_ADMIN';
  }

  ngOnInit() {
    this.cargarEncargos();
    if (this.esAdmin) {
      this.clienteService.getClientes().subscribe({ next: (d) => (this.clientesLista = d), error: () => {} });
      this.articuloService.getArticulos().subscribe({ next: (d) => (this.articulosLista = d), error: () => {} });
    }
  }

  cargarEncargos() {
    this.cargando = true;
    this.errorCarga = null;
    this.encargoService.getEncargos().subscribe({
      next: (data) => {
        this.encargos = data.sort((a, b) => b.fechaEncargo.localeCompare(a.fechaEncargo));
        this.cargando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aplicarFiltros() {
    let resultado = this.encargos;

    if (this.filtroCliente.trim()) {
      const q = this.filtroCliente.toLowerCase();
      resultado = resultado.filter(
        (e) =>
          e.cliente.nombre.toLowerCase().includes(q) ||
          e.cliente.apellidos.toLowerCase().includes(q),
      );
    }

    if (this.filtroEstado) {
      resultado = resultado.filter((e) => e.estado === this.filtroEstado);
    }

    const sorted = this.applySorting(resultado);
    this.totalPages = Math.ceil(sorted.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.encargosFiltrados = sorted;
    this.encargosPaginados = sorted.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.aplicarFiltros();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.aplicarFiltros();
    }
  }

  volverAlMenu() {
    this.router.navigate(['/menu']);
  }

  fechaEncargo(e: Encargo): string {
    if (!e.fechaEncargo) return '';
    const [y, m, d] = e.fechaEncargo.split('T')[0].split('-');
    return (d && m && y) ? `${d}/${m}/${y}` : '';
  }

  fechaEntrega(e: Encargo): string {
    if (!e.fechaEntregaPrevista) return '—';
    const [y, m, d] = e.fechaEntregaPrevista.split('T')[0].split('-');
    return (d && m && y) ? `${d}/${m}/${y}` : '—';
  }

  estadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':  return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'EN_PROCESO': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'LISTO':      return 'bg-green-100 text-green-700 border border-green-300';
      case 'ENTREGADO':  return 'bg-gray-100 text-gray-500 border border-gray-300';
      case 'CANCELADO':  return 'bg-red-100 text-red-400 border border-red-300';
      default:           return 'bg-gray-100 text-gray-500 border border-gray-300';
    }
  }

  eliminarEncargo(encargo: Encargo) {
    if (!encargo.id) return;
    if (!confirm(`¿Eliminar el encargo #${encargo.id}? Esta acción no se puede deshacer.`)) return;
    this.encargoService.deleteEncargo(encargo.id).subscribe({
      next: () => {
        this.encargos = this.encargos.filter((e) => e.id !== encargo.id);
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'Error al eliminar el encargo. Intenta de nuevo.';
        this.cdr.detectChanges();
      },
    });
  }

  get totalEncargos(): number {
    return this.encargos.length;
  }
  get encargosActivos(): number {
    return this.encargos.filter((e) => e.estado === 'PENDIENTE' || e.estado === 'EN_PROCESO').length;
  }

  // === NUEVO ENCARGO ===
  abrirNuevo() {
    const hoy = new Date().toISOString().slice(0, 16);
    this.nuevoEncargo = {
      clienteId: null, productoId: null,
      fechaEncargo: hoy, fechaEntregaPrevista: '',
      tipoEncargo: 'MONTURA', estado: 'PENDIENTE',
      proveedor: '', numeroPedidoFabrica: '', observaciones: ''
    };
    this.errorNuevo = null;
    this.mostrarNuevo = true;
  }

  cerrarNuevo() {
    this.mostrarNuevo = false;
    this.errorNuevo = null;
  }

  crearEncargo() {
    if (!this.nuevoEncargo.clienteId) { this.errorNuevo = 'Selecciona un cliente.'; return; }
    if (!this.nuevoEncargo.tipoEncargo) { this.errorNuevo = 'El tipo de encargo es obligatorio.'; return; }
    if (!this.nuevoEncargo.estado) { this.errorNuevo = 'El estado es obligatorio.'; return; }
    if (!this.nuevoEncargo.fechaEncargo) { this.errorNuevo = 'La fecha del encargo es obligatoria.'; return; }

    const cliente = this.clientesLista.find((c) => c.id === Number(this.nuevoEncargo.clienteId));
    const producto = this.articulosLista.find((a) => a.id === Number(this.nuevoEncargo.productoId));
    if (!cliente) { this.errorNuevo = 'Cliente no válido.'; return; }

    const payload: Omit<Encargo, 'id'> = {
      cliente: { id: cliente.id!, nombre: cliente.nombre, apellidos: cliente.apellidos },
      producto: producto ? { id: producto.id!, modelo: producto.modelo, marca: producto.marca } : undefined,
      // El input datetime-local devuelve "YYYY-MM-DDTHH:mm" (sin segundos) pero LocalDateTime necesita segundos
      fechaEncargo: this.nuevoEncargo.fechaEncargo.length === 16
        ? this.nuevoEncargo.fechaEncargo + ':00'
        : this.nuevoEncargo.fechaEncargo,
      fechaEntregaPrevista: this.nuevoEncargo.fechaEntregaPrevista
        ? (this.nuevoEncargo.fechaEntregaPrevista.length === 16
          ? this.nuevoEncargo.fechaEntregaPrevista + ':00'
          : this.nuevoEncargo.fechaEntregaPrevista)
        : undefined,
      tipoEncargo: this.nuevoEncargo.tipoEncargo,
      estado: this.nuevoEncargo.estado,
      proveedor: this.nuevoEncargo.proveedor || undefined,
      numeroPedidoFabrica: this.nuevoEncargo.numeroPedidoFabrica || undefined,
      observaciones: this.nuevoEncargo.observaciones || undefined,
    };

    this.creando = true;
    this.errorNuevo = null;
    this.encargoService.createEncargo(payload).subscribe({
      next: (creado) => {
        this.encargos.unshift(creado);
        this.cerrarNuevo();
        this.creando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorNuevo = err.error?.error ?? 'Error al crear el encargo. Intenta de nuevo.';
        this.creando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
