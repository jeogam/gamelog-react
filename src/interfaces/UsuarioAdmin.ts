export type PapelUsuario = "ADMINISTRADOR" | "MODERADOR" | "USUARIO";

export interface UsuarioAdmin {
  id: string;        // UUID
  nome: string;
  email: string;
  papel: PapelUsuario;
}
