export interface Graduacion {
  id?: number;
  cliente: { id: number };
  fechaRevision: string;
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
