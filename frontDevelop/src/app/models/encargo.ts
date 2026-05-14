// producto es opcional: un encargo puede no tener montura asociada en el catálogo
export interface Encargo {
  id?: number;
  cliente: { id: number; nombre: string; apellidos: string; };
  producto?: { id: number; modelo: string; marca: string; };
  fechaEncargo: string;
  fechaEntregaPrevista?: string;
  tipoEncargo: string;
  proveedor?: string;
  numeroPedidoFabrica?: string;
  estado: string;
  observaciones?: string;
  tecnicoAsignado?: { id: number; nombre: string; };
}
