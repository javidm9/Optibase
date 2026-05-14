import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Venta } from '../../models/venta';
import { Cliente } from '../../models/cliente';
import { Articulo } from '../../models/articulo';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { ArticuloService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
})
export class VentasPage implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  ventasPaginadas: Venta[] = [];

  cargando = false;
  errorCarga: string | null = null;

  filtroCliente = '';
  filtroFecha = '';
  filtroPagado = '';

  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  esAdmin = false;

  // Modal Nueva Venta
  mostrarNueva = false;
  clientesLista: Cliente[] = [];
  articulosLista: Articulo[] = [];
  nuevaVenta: {
    clienteId: number | null;
    productoId: number | null;
    importe: number;
    metodoPago: string;
    pagado: boolean;
  } = { clienteId: null, productoId: null, importe: 0, metodoPago: 'EFECTIVO', pagado: false };
  creando = false;
  errorNueva: string | null = null;
  readonly metodosPago = ['EFECTIVO', 'TARJETA'];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private articuloService: ArticuloService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.esAdmin = this.authService.getRol() === 'ROLE_ADMIN';
  }

  ngOnInit() {
    this.cargarVentas();
    if (this.esAdmin) {
      this.clienteService.getClientes().subscribe({ next: (d) => (this.clientesLista = d), error: () => {} });
      this.articuloService.getArticulos().subscribe({ next: (d) => (this.articulosLista = d), error: () => {} });
    }
  }

  cargarVentas() {
    this.cargando = true;
    this.errorCarga = null;
    this.ventaService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data.sort((a, b) => b.fechaVenta.localeCompare(a.fechaVenta));
        this.cargando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltros() {
    let resultado = this.ventas;

    if (this.filtroCliente.trim()) {
      const q = this.filtroCliente.toLowerCase();
      resultado = resultado.filter(
        (v) =>
          v.cliente.nombre.toLowerCase().includes(q) ||
          v.cliente.apellidos.toLowerCase().includes(q),
      );
    }

    if (this.filtroFecha) {
      resultado = resultado.filter((v) => v.fechaVenta.startsWith(this.filtroFecha));
    }

    if (this.filtroPagado !== '') {
      const pagado = this.filtroPagado === 'true';
      resultado = resultado.filter((v) => v.pagado === pagado);
    }

    const sorted = this.applySorting(resultado);
    this.totalPages = Math.ceil(sorted.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.ventasFiltradas = sorted;
    this.ventasPaginadas = sorted.slice(start, start + this.itemsPerPage);
  }

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

  private applySorting(data: Venta[]): Venta[] {
    if (!this.sortColumn) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      switch (this.sortColumn) {
        case 'fechaVenta': cmp = a.fechaVenta.localeCompare(b.fechaVenta); break;
        case 'importe':    cmp = a.importe - b.importe; break;
        case 'metodoPago': cmp = a.metodoPago.localeCompare(b.metodoPago); break;
        case 'pagado':     cmp = Number(a.pagado) - Number(b.pagado); break;
      }
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
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

  fechaVenta(v: Venta): string {
    return v.fechaVenta ? v.fechaVenta.split('T')[0] : '';
  }

  horaVenta(v: Venta): string {
    return v.fechaVenta ? (v.fechaVenta.split('T')[1] ?? '').substring(0, 5) : '';
  }

  eliminarVenta(venta: Venta) {
    if (!venta.id) return;
    if (!confirm(`¿Eliminar la venta #${venta.id}? Esta acción no se puede deshacer.`)) return;
    this.ventaService.deleteVenta(venta.id).subscribe({
      next: () => {
        this.ventas = this.ventas.filter((v) => v.id !== venta.id);
        this.aplicarFiltros();
      },
      error: () => {
        this.errorCarga = 'Error al eliminar la venta. Intenta de nuevo.';
        this.cdr.detectChanges();
      },
    });
  }

  get totalVentas(): number {
    return this.ventas.length;
  }
  get ventasPendientesCount(): number {
    return this.ventas.filter((v) => !v.pagado).length;
  }
  get importeTotal(): number {
    return this.ventas.reduce((sum, v) => sum + v.importe, 0);
  }

  // === NUEVA VENTA ===
  abrirNueva() {
    this.nuevaVenta = { clienteId: null, productoId: null, importe: 0, metodoPago: 'EFECTIVO', pagado: false };
    this.errorNueva = null;
    this.mostrarNueva = true;
  }

  cerrarNueva() {
    this.mostrarNueva = false;
    this.errorNueva = null;
  }

  crearVenta() {
    if (!this.nuevaVenta.clienteId) { this.errorNueva = 'Selecciona un cliente.'; return; }
    if (!this.nuevaVenta.productoId) { this.errorNueva = 'Selecciona un producto.'; return; }
    if (!this.nuevaVenta.importe || this.nuevaVenta.importe <= 0) { this.errorNueva = 'El importe debe ser mayor a 0.'; return; }
    if (!this.nuevaVenta.metodoPago) { this.errorNueva = 'Selecciona un método de pago.'; return; }

    // Busco los objetos completos en las listas porque el backend necesita el objeto anidado, no solo el ID
    const cliente = this.clientesLista.find((c) => c.id === Number(this.nuevaVenta.clienteId));
    const producto = this.articulosLista.find((a) => a.id === Number(this.nuevaVenta.productoId));
    const nombre = this.authService.getNombre() ?? '';
    const userId = localStorage.getItem('userId');

    if (!cliente || !producto) { this.errorNueva = 'Cliente o producto no válido.'; return; }

    const payload: Omit<Venta, 'id'> = {
      cliente: { id: cliente.id!, nombre: cliente.nombre, apellidos: cliente.apellidos },
      producto: { id: producto.id!, modelo: producto.modelo, marca: producto.marca },
      vendedor: { id: userId ? Number(userId) : 1, nombre },
      fechaVenta: new Date().toISOString().slice(0, 19),
      importe: Number(this.nuevaVenta.importe),
      metodoPago: this.nuevaVenta.metodoPago,
      pagado: this.nuevaVenta.pagado,
    };

    this.creando = true;
    this.errorNueva = null;
    this.ventaService.createVenta(payload).subscribe({
      next: (creada) => {
        this.ventas.unshift(creada);
        this.cerrarNueva();
        this.creando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorNueva = err.error?.error ?? 'Error al registrar la venta. Intenta de nuevo.';
        this.creando = false;
      },
    });
  }
}
