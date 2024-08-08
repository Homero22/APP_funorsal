import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { CuentasService } from 'src/app/core/services/cuentas.service';
import { libroDiarioService } from 'src/app/core/services/libroDiario.service';
import Swal from 'sweetalert2';
interface DetalleLibroDiario {
  int_detalle_libro_diario_id: number;
  int_libro_diario_id: number;
  str_detalle_libro_diario_nombre_cuenta: string;
  str_detalle_libro_diario_codigo_cuenta: string;
  str_detalle_libro_diario_tipo: string;
  dc_detalle_libro_diario_monto: string;
  dt_fecha_creacion: string;
  dt_fecha_actualizacion: string;
}

interface LibroDiario {
  int_libro_diario_id: number;
  dt_libro_diario_fecha: string;
  int_cliente_id: number;
  str_libro_diario_descripcion: string | null;
  detalle_libro_diarios: DetalleLibroDiario[];
}

@Component({
  selector: 'app-ver-diarios',
  templateUrl: './ver-diarios.component.html',
  styleUrls: ['./ver-diarios.component.css']
})
export class VerDiariosComponent implements OnInit {
  informacionQuesera!: any;
  journalEntries: LibroDiario[] = [];
  displayedColumns: string[] = ['int_libro_diario_id', 'dt_libro_diario_fecha', 'detalle_libro_diarios'];

  constructor(
    private srvCliente: ClienteService,
    private srvCuentas: CuentasService,
    private srvLibroDiario: libroDiarioService
  ) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      //this.srvCuentas.obtenerCuentasDelCliente(this.informacionQuesera.int_cliente_id);
      this.obtenerLibrosDiarios();
    });
   }

  ngOnInit() {
  }

  dataLibroDiario : any;


  obtenerLibrosDiarios(){
    this.srvLibroDiario.getLibrosDiarios(this.informacionQuesera.int_cliente_id)
    .subscribe((librosDiarios: any) => {
      if(librosDiarios.status){
        Swal.fire({
          title: 'Libros Diarios',
          icon: 'success',
          text:librosDiarios.message,
        })
        this.journalEntries = librosDiarios.body;
      }else{
        Swal.fire({
          title: 'Libros Diarios',
          icon: 'error',
          text:librosDiarios.message,
        })
      }

    });
  }
}
