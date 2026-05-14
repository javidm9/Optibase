// Espeja la entidad VentaModel del backend: cliente, producto y vendedor como objetos anidados con solo los campos necesarios
export interface Venta {
  id?: number;
  cliente: { id: number; nombre: string; apellidos: string; };
  producto: { id: number; modelo: string; marca: string; };
  vendedor: { id: number; nombre: string; };
  fechaVenta: string;
  importe: number;
  metodoPago: string;
  pagado: boolean;
}
