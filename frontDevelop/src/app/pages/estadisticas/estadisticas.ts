import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Cita } from '../../models/cita';
import { Venta } from '../../models/venta';
import { Articulo } from '../../models/articulo';
import { Encargo } from '../../models/encargo';
import { CitaService } from '../../services/cita.service';
import { VentaService } from '../../services/venta.service';
import { ArticuloService } from '../../services/producto.service';
import { EncargoService } from '../../services/encargo.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
})
export class EstadisticasPage implements OnInit {
  cargando = true;
  errorCarga: string | null = null;

  citasHoy = 0;
  citasPendientes = 0;
  ventasHoy = 0;
  totalVentasMes = 0;
  encargosPendientes = 0;
  totalClientes = 0;
  productosAgotados = 0;
  ultimasVentas: Venta[] = [];
  proximasCitas: Cita[] = [];

  constructor(
    private citaService: CitaService,
    private ventaService: VentaService,
    private articuloService: ArticuloService,
    private encargoService: EncargoService,
    private clienteService: ClienteService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.errorCarga = null;
    // forkJoin lanza todas las peticiones en paralelo y espera a que lleguen todas antes de procesar
    forkJoin({
      citas: this.citaService.getCitas(),
      ventas: this.ventaService.getVentas(),
      articulos: this.articuloService.getArticulos(),
      encargos: this.encargoService.getEncargos(),
      clientes: this.clienteService.getClientes(),
    }).subscribe({
      next: ({ citas, ventas, articulos, encargos, clientes }) => {
        this.procesarDatos(citas, ventas, articulos, encargos, clientes);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  private procesarDatos(
    citas: Cita[],
    ventas: Venta[],
    articulos: Articulo[],
    encargos: Encargo[],
    clientes: any[],
  ) {
    const hoy = this.todayStr();
    const ahora = new Date();

    // Citas
    this.citasHoy = citas.filter((c) => c.fechaHora.startsWith(hoy)).length;
    this.citasPendientes = citas.filter((c) => c.estado === 'PENDIENTE').length;
    this.proximasCitas = citas
      .filter((c) => c.estado === 'PENDIENTE' && new Date(c.fechaHora) >= ahora)
      .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
      .slice(0, 5);

    // Ventas
    this.ventasHoy = ventas.filter((v) => v.fechaVenta.startsWith(hoy)).length;
    this.totalVentasMes = ventas
      .filter((v) => this.esMesActual(v.fechaVenta))
      .reduce((sum, v) => sum + v.importe, 0);
    this.ultimasVentas = [...ventas]
      .sort((a, b) => b.fechaVenta.localeCompare(a.fechaVenta))
      .slice(0, 5);

    // Stock
    this.productosAgotados = articulos.filter((a) => a.stock === 0).length;

    // Encargos
    this.encargosPendientes = encargos.filter(
      (e) => e.estado === 'PENDIENTE' || e.estado === 'EN_PROCESO',
    ).length;

    // Clientes
    this.totalClientes = clientes.length;
  }

  // Devuelvo el formato YYYY-MM-DD para comparar con el prefijo de las fechas ISO que devuelve el backend
  private todayStr(): string {
    const d = new Date();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dd}`;
  }

  private esMesActual(fechaStr: string): boolean {
    const d = new Date(fechaStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }

  fechaCorta(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('T')[0].split('-');
    return (d && m && y) ? `${d}/${m}/${y}` : '';
  }

  horaCorta(iso: string): string {
    return iso ? (iso.split('T')[1] ?? '').substring(0, 5) : '';
  }

  estadoCitaClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':  return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'COMPLETADA': return 'bg-green-100 text-green-700 border border-green-300';
      case 'CANCELADA':  return 'bg-gray-100 text-gray-400 border border-gray-300';
      default:           return 'bg-gray-100 text-gray-400 border border-gray-300';
    }
  }

  volverAlMenu()     { this.router.navigate(['/menu']); }
  irACitas()         { this.router.navigate(['/citas']); }
  irAVentas()        { this.router.navigate(['/ventas']); }
  irAEncargos()      { this.router.navigate(['/encargos']); }
  irAInventario()    { this.router.navigate(['/inventario']); }
}
