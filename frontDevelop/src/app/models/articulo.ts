// Espeja la entidad ProductoModel del backend; los campos coinciden exactamente para que el binding funcione sin transformaciones
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
