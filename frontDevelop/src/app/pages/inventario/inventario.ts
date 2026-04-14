import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Articulo, CategoriaArticulo } from '../../models/articulo';
import { ArticuloService } from '../../services/articulo.service';

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

  categoriaActiva: 'TODOS' | CategoriaArticulo = 'TODOS';
  filtroNombre = '';
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

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

  readonly categorias: { value: CategoriaArticulo; label: string }[] = [
    { value: 'MONTURA',  label: 'Montura' },
    { value: 'GAFA_SOL', label: 'Gafa de Sol' },
    { value: 'LIQUIDO',  label: 'Líquido' },
  ];

  constructor(private articuloService: ArticuloService, private router: Router) {}

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
      },
      error: () => {
        this.errorCarga = 'No se pudo conectar con el servidor. Verifica que el backend esté activo en localhost:8080.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros() {
    let resultado = this.articulos;
    if (this.categoriaActiva !== 'TODOS') {
      resultado = resultado.filter(a => a.categoria === this.categoriaActiva);
    }
    if (this.filtroNombre.trim()) {
      const q = this.filtroNombre.toLowerCase();
      resultado = resultado.filter(a =>
        a.nombre.toLowerCase().includes(q) ||
        a.marca.toLowerCase().includes(q) ||
        a.referencia.toLowerCase().includes(q)
      );
    }
    this.totalPages = Math.ceil(resultado.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.articulosFiltrados = resultado;
    this.articulosPaginados = resultado.slice(start, start + this.itemsPerPage);
  }

  setCategoriaActiva(cat: string) {
    this.categoriaActiva = cat as 'TODOS' | CategoriaArticulo;
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

  categoriaLabel(cat: CategoriaArticulo): string {
    return this.categorias.find(c => c.value === cat)?.label ?? cat;
  }

  stockClass(stock: number): string {
    if (stock <= 0) return 'text-red-600 font-black';
    if (stock <= 5) return 'text-orange-500 font-bold';
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
      },
      error: (err) => {
        this.errorModal = err.status === 400
          ? 'El servidor ha rechazado la operación (stock inválido).'
          : 'Error al guardar. Intenta de nuevo.';
        this.guardando = false;
      }
    });
  }

  eliminarArticulo(articulo: Articulo) {
    if (!articulo.id) return;
    if (!confirm(`¿Eliminar "${articulo.nombre}" del inventario? Esta acción no se puede deshacer.`)) return;
    this.articuloService.deleteArticulo(articulo.id).subscribe({
      next: () => {
        this.articulos = this.articulos.filter(a => a.id !== articulo.id);
        this.cerrarModal();
        this.aplicarFiltros();
      },
      error: () => { this.errorModal = 'Error al eliminar. Intenta de nuevo.'; }
    });
  }

  // === NUEVO ARTÍCULO ===
  abrirNuevo() {
    this.nuevoArticulo = {
      nombre: '', referencia: '', categoria: 'MONTURA',
      marca: '', precio: 0, stock: 0, descripcion: ''
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
    if (!this.nuevoArticulo.nombre?.trim() || !this.nuevoArticulo.referencia?.trim()) {
      this.errorNuevo = 'Nombre y referencia son obligatorios.';
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
      },
      error: (err) => {
        this.errorNuevo = err.status === 400
          ? 'El servidor ha rechazado la operación (stock inválido).'
          : 'Error al crear el artículo. Intenta de nuevo.';
        this.creando = false;
      }
    });
  }

  get totalArticulos(): number { return this.articulos.length; }
  get articulosAgotados(): number { return this.articulos.filter(a => a.stock <= 0).length; }
  get articulosStockBajo(): number { return this.articulos.filter(a => a.stock > 0 && a.stock <= 5).length; }
}
