import { Component, OnInit } from '@angular/core';
import { CuentasService } from '../../core/services/cuentas.service';
import { Cuenta } from '../plan-cuentas.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ViewChild} from '@angular/core';
import {MatAccordion,} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import Swal from 'sweetalert2';
import { ClienteService } from 'src/app/core/services/cliente.service';


@Component({
  selector: 'app-agregar-cuenta',
  templateUrl: './agregar-cuenta.component.html',
  styleUrls: ['./agregar-cuenta.component.css']
})
export class AgregarCuentaComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  panelExpandido = false; // Variable que controla el estado del panel

  cuentas: Cuenta[] = [];
  newCuenta: { nombre: string; codigo: string; int_cuenta_id: number; int_cuenta_padre_id: number | null } = { nombre: '', codigo: '', int_cuenta_id: 0, int_cuenta_padre_id: null };
  searchCuenta! :any;

  infoCuentaSeleccionada!: Cuenta;

  informacionQuesera!: any;

  constructor(
    private srvCuentas: CuentasService,
    private srvCliente: ClienteService,
  ) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;

    });
   }

  ngOnInit() {
    this.srvCuentas.selectCuentasHijasByPadreId
    .subscribe((cuentas: Cuenta[]) => {
      this.cuentas = cuentas;
    }
    );

    this.srvCuentas.selectCuentaSeleccionada
    .subscribe((cuenta: Cuenta) => {
      this.infoCuentaSeleccionada = cuenta;
    });

  }

  buscarCuenta() {
    this.cuentas = this.cuentas.filter((cuenta: { str_cuenta_nombre: string; }) => cuenta.str_cuenta_nombre.toLowerCase().includes(this.searchCuenta.toLowerCase()));


  }



 comprobarCodigo(codigo: string) {
  //no puede ingresar un código de la lista de códigos existentes en this.cuentas
  //tampoco puede ingresar el código de la cuenta seleccionada
  const códigos = this.cuentas.map(cuenta => cuenta.str_cuenta_codigo);
  return códigos.includes(codigo) || this.infoCuentaSeleccionada.str_cuenta_codigo === codigo;
  }



  agregarCuenta() {
    const comprobar = this.comprobarCodigo(this.newCuenta.codigo);
    if (comprobar) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El código de la cuenta ya existe o es el mismo de la cuenta seleccionada',
      });
      return;
    }else{
      const nuevaCuenta = {
        str_cuenta_nombre: this.newCuenta.nombre,
        str_cuenta_codigo: this.newCuenta.codigo,
        int_cuenta_padre_id: this.infoCuentaSeleccionada.int_cuenta_id,
        int_cliente_id: this.informacionQuesera.int_cliente_id
      };
      this.srvCuentas.agregarCuentaByIdCliente(nuevaCuenta).pipe()
      .subscribe((res: any) => {
        if(res.status){
          Swal.fire({
            icon: 'success',
            title: 'Cuenta agregada',
            text: res.message,
          });
          this.srvCuentas.obtenerCuentasDelCliente(this.informacionQuesera.int_cliente_id);
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
          });
        }

      });

      this.newCuenta = { nombre: '', codigo: '', int_cuenta_id: 0, int_cuenta_padre_id: null };
    }
  }

}
