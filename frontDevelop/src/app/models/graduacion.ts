export interface Graduacion {
  id?: number;
  clienteId: number;
  fecha: string;
  // Ojo Derecho
  odEsfera: number;
  odCilindro: number;
  odEje: number;
  odAdicion?: number;
  // Ojo Izquierdo
  oiEsfera: number;
  oiCilindro: number;
  oiEje: number;
  oiAdicion?: number;
  observaciones?: string;
}
