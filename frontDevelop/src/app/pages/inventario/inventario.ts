import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Articulo, CategoriaProducto } from '../../models/articulo';
import { ArticuloService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
})
export class InventarioPage implements OnInit {

  articulos: Articulo[] = [];
  articulosFiltrados: Articulo[] = [];
  articulosPaginados: Articulo[] = [];
  cargando = false;
  errorCarga: string | null = null;

  categoriaActiva: 'TODOS' | CategoriaProducto = 'TODOS';
  filtroNombre = '';
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Modal Ver / Editar
  articuloSeleccionado: Articulo | null = null;
  modoEdicion = false;
  articuloEditando: Partial<Articulo> = {};
  guardando = false;
  errorModal: string | null = null;

  // Modal Nuevo
  mostrarNuevo = false;
  nuevoArticulo: Partial<Articulo> = {};
  creando = false;
  errorNuevo: string | null = null;

  readonly categorias: { value: CategoriaProducto; label: string }[] = [
    { value: 'MONTURA',  label: 'Montura' },
    { value: 'GAFA_SOL', label: 'Gafa de Sol' },
    { value: 'LIQUIDO',  label: 'Líquido' },
    { value: 'LENTE',    label: 'Lente' },
  ];

  esAdmin = false;

  constructor(private articuloService: ArticuloService, private router: Router, private cdr: ChangeDetectorRef, private authService: AuthService) {
    this.esAdmin = this.authService.getRol() === 'ROLE_ADMIN';
  }

  ngOnInit() {
    this.cargarArticulos();
  }

  cargarArticulos() {
    this.cargando = true;
    this.errorCarga = null;
    this.articuloService.getArticulos().subscribe({
      next: (data) => {
        this.articulos = data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        this.cargando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica la conexión.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros() {
    let resultado = this.articulos;
    if (this.categoriaActiva !== 'TODOS') {
      resultado = resultado.filter(a => a.tipo === this.categoriaActiva);
    }
    if (this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase();
      resultado = resultado.filter(a =>
        a.modelo.toLowerCase().includes(q) ||
        a.marca.toLowerCase().includes(q)
      );
    }
    const sorted = this.applySorting(resultado);
    this.totalPages = Math.ceil(sorted.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.articulosFiltrados = sorted;
    this.articulosPaginados = sorted.slice(start, start + this.itemsPerPage);
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

  private applySorting(data: Articulo[]): Articulo[] {
    if (!this.sortColumn) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      switch (this.sortColumn) {
        case 'marca':  cmp = a.marca.localeCompare(b.marca); break;
        case 'modelo': cmp = a.modelo.localeCompare(b.modelo); break;
        case 'tipo':   cmp = a.tipo.localeCompare(b.tipo); break;
        case 'precio': cmp = a.precio - b.precio; break;
        case 'stock':  cmp = a.stock - b.stock; break;
      }
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
  }

  setCategoriaActiva(cat: string) {
    this.categoriaActiva = cat as 'TODOS' | CategoriaProducto;
    this.currentPage = 1;
    this.aplicarFiltros();
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

  categoriaLabel(tipo: CategoriaProducto): string {
    return this.categorias.find(c => c.value === tipo)?.label ?? tipo;
  }

  stockClass(stock: number): string {
    if (stock <= 0) return 'text-red-600 font-black';
    return 'text-gray-950 font-bold';
  }

  // === VER / EDITAR ===
  verArticulo(articulo: Articulo) {
    this.articuloSeleccionado = articulo;
    this.modoEdicion = false;
    this.errorModal = null;
  }

  cerrarModal() {
    this.articuloSeleccionado = null;
    this.modoEdicion = false;
    this.articuloEditando = {};
    this.errorModal = null;
  }

  iniciarEdicion() {
    this.articuloEditando = { ...this.articuloSeleccionado };
    this.modoEdicion = true;
    this.errorModal = null;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.articuloEditando = {};
    this.errorModal = null;
  }

  guardarCambios() {
    if (!this.articuloSeleccionado?.id) return;
    if (!this.articuloEditando.marca?.trim()) {
      this.errorModal = 'La marca es obligatoria.';
      return;
    }
    if ((this.articuloEditando.stock ?? 0) < 0) {
      this.errorModal = 'El stock no puede ser negativo.';
      return;
    }
    this.guardando = true;
    this.errorModal = null;
    this.articuloService.updateArticulo(this.articuloSeleccionado.id, this.articuloEditando).subscribe({
      next: (actualizado) => {
        const idx = this.articulos.findIndex(a => a.id === actualizado.id);
        if (idx !== -1) this.articulos[idx] = actualizado;
        this.articuloSeleccionado = actualizado;
        this.modoEdicion = false;
        this.guardando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorModal = err.status === 400
          ? 'El servidor ha rechazado la operación (stock inválido).'
          : 'Error al guardar. Intenta de nuevo.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarArticulo(articulo: Articulo) {
    if (!articulo.id) return;
    if (!confirm(`¿Eliminar "${articulo.modelo}" del inventario? Esta acción no se puede deshacer.`)) return;
    this.articuloService.deleteArticulo(articulo.id).subscribe({
      next: () => {
        this.articulos = this.articulos.filter(a => a.id !== articulo.id);
        this.cerrarModal();
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorModal = 'Error al eliminar. Intenta de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }

  // === NUEVO ARTÍCULO ===
  abrirNuevo() {
    this.nuevoArticulo = {
      modelo: '', tipo: 'MONTURA',
      marca: '', precio: 0, stock: 0
    };
    this.mostrarNuevo = true;
    this.errorNuevo = null;
  }

  cerrarNuevo() {
    this.mostrarNuevo = false;
    this.nuevoArticulo = {};
    this.errorNuevo = null;
  }

  crearArticulo() {
    if (!this.nuevoArticulo.modelo?.trim()) {
      this.errorNuevo = 'El nombre del modelo es obligatorio.';
      return;
    }
    if (!this.nuevoArticulo.marca?.trim()) {
      this.errorNuevo = 'La marca es obligatoria.';
      return;
    }
    if ((this.nuevoArticulo.stock ?? 0) < 0) {
      this.errorNuevo = 'El stock no puede ser negativo.';
      return;
    }
    this.creando = true;
    this.errorNuevo = null;
    this.articuloService.createArticulo(this.nuevoArticulo as Omit<Articulo, 'id'>).subscribe({
      next: (creado) => {
        this.articulos.unshift(creado);
        this.cerrarNuevo();
        this.creando = false;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorNuevo = err.status === 400
          ? 'El servidor ha rechazado la operación (stock inválido).'
          : 'Error al crear el artículo. Intenta de nuevo.';
        this.creando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalArticulos(): number { return this.articulos.length; }
  get articulosAgotados(): number { return this.articulos.filter(a => a.stock <= 0).length; }
}
