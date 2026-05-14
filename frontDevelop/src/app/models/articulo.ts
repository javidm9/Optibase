export type CategoriaProducto = 'MONTURA' | 'GAFA_SOL' | 'LIQUIDO' | 'LENTE';

export interface Articulo {
  id?: number;
  modelo: string;
  tipo: CategoriaProducto;
  marca: string;
  precio: number;
  stock: number;
  esRecambio?: boolean;
}
