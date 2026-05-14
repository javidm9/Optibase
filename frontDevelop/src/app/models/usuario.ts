// Refleja exactamente los campos de UsuarioModel del backend.
// contrasenya no viene en las respuestas (el back tiene @JsonIgnore),
// pero la incluyo como opcional para poder enviarla al crear o editar.
export interface Usuario {
  id?: number;
  nombre: string;
  contrasenya?: string;
  rol: 'ROLE_ADMIN' | 'ROLE_USER';
}
