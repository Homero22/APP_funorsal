export interface Cliente {
  status: boolean;
  message: string;
  body: Body;
}
export interface Body {
  count: number;
  rows: ClienteData[];
}

export interface ClienteData{
  int_cliente_id: number;
  str_cliente_nombre: string;
  str_cliente_ruc: string;
  str_cliente_correo: string;
  str_cliente_telefono: string;
  str_cliente_direccion: string;
  str_cliente_password: string;
  str_cliente_usuario: string;
}
