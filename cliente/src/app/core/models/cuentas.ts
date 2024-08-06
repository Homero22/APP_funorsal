// cuenta.interface.ts

export interface Cuenta {
  int_cuenta_id: number;
  str_cuenta_nombre: string;
  str_cuenta_codigo: string;
  int_cuenta_padre_id: number | null;
}
