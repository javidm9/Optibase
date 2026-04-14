export type EstadoCita = 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';

export interface Cita {
  id?: number;
  clienteId: number;
  clienteNombre?: string;
  fecha: string;       // YYYY-MM-DD
  hora: string;        // HH:mm
  duracion: number;    // minutos
  motivo: string;
  estado: EstadoCita;
}
