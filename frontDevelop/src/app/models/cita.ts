export type EstadoCita = 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';

export interface Cita {
  id?: number;
  fechaHora: string;   // ISO: "YYYY-MM-DDTHH:mm:ss"
  motivo: string;
  estado: EstadoCita;
  cliente: { id: number; nombre: string; apellidos: string; };
}
