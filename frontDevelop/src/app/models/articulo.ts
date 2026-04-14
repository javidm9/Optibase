export type CategoriaArticulo = 'MONTURA' | 'GAFA_SOL' | 'LIQUIDO';

export interface Articulo {
  id?: number;
  nombre: string;
  referencia: string;
  categoria: CategoriaArticulo;
  marca: string;
  precio: number;
  stock: number;
  descripcion?: string;
}
