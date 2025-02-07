import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { CuentasService } from 'src/app/core/services/cuentas.service';
import { libroDiarioService } from 'src/app/core/services/libroDiario.service';
import Swal from 'sweetalert2';
import { MatFormField } from '@angular/material/form-field';
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
  styleUrls: ['./ver-diarios.component.css'],
})
export class VerDiariosComponent implements OnInit {
  informacionQuesera!: any;
  journalEntries: LibroDiario[] = [];
  displayedColumns: string[] = [
    'int_libro_diario_id',
    'dt_libro_diario_fecha',
    'detalle_libro_diarios',
    'acciones',	
  ];

  meses = [
    { value: 1, viewValue: 'Enero' },
    { value: 2, viewValue: 'Febrero' },
    { value: 3, viewValue: 'Marzo' },
    { value: 4, viewValue: 'Abril' },
    { value: 5, viewValue: 'Mayo' },
    { value: 6, viewValue: 'Junio' },
    { value: 7, viewValue: 'Julio' },
    { value: 8, viewValue: 'Agosto' },
    { value: 9, viewValue: 'Septiembre' },
    { value: 10, viewValue: 'Octubre' },
    { value: 11, viewValue: 'Noviembre' },
    { value: 12, viewValue: 'Diciembre' },
  ];
  mes = new Date().getMonth() + 1;
  anio = new Date().getFullYear();
  totalEntries: number = 0;

  constructor(
    private srvCliente: ClienteService,
    private srvCuentas: CuentasService,
    private srvLibroDiario: libroDiarioService
  ) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      //this.srvCuentas.obtenerCuentasDelCliente(this.informacionQuesera.int_cliente_id);
      this.obtenerLibrosDiarios(10, 0, this.mes, this.anio);
    });
  }

  ngOnInit() {}

  dataLibroDiario: any;

  obtenerLibrosDiarios(limit = 10, offset = 0, mes?: number, anio?: number) {
    this.srvLibroDiario
      .getLibrosDiarios(
        this.informacionQuesera.int_cliente_id,
        limit,
        offset,
        mes,
        anio
      )
      .subscribe((librosDiarios: any) => {
        if (librosDiarios.status) {

          Swal.fire({
            title: 'Libros Diarios',
            icon: 'success',
            text: librosDiarios.message,
          });
          console.log(librosDiarios.body);
          this.journalEntries = librosDiarios.body;
          this.totalEntries = librosDiarios.total;
        } else {
          Swal.fire({
            title: 'Libros Diarios',
            icon: 'error',
            text: librosDiarios.message,
          });
          this.journalEntries = [];
        }
      });
  }

  aplicarFiltro() {
    this.obtenerLibrosDiarios(10, 0, this.mes, this.anio);
  }

  cambiarPagina(event: PageEvent) {
    console.log(event);
    this.obtenerLibrosDiarios(
      event.pageSize,
      event.pageIndex  * event.pageSize ,
      this.mes,
      this.anio
    );
  }

    // Datos para editar
    libroDiarioSeleccionado: any = null;

    toggleEditar(element: any) {
        this.libroDiarioSeleccionado = { ...element };
    }

    guardarEdicion() {
        //comprobar las sumas de tipo DEBE y HABER del libro diario seleccionado
        let totalDebe = 0;
        let totalHaber = 0;
        this.libroDiarioSeleccionado.detalle_libro_diarios.forEach((detalle: any) => {
            if (detalle.str_detalle_libro_diario_tipo === 'DEBE') {
                totalDebe += Number(detalle.dc_detalle_libro_diario_monto);
            } else {
                totalHaber += Number(detalle.dc_detalle_libro_diario_monto);
            }
        });

        if(totalDebe !== totalHaber){
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Las sumas de DEBE y HABER no coinciden',
            });
            return;
        }

        //enviar a la API
        this.srvLibroDiario.editarLibroDiario(this.libroDiarioSeleccionado, this.libroDiarioSeleccionado.int_libro_diario_id)
            .subscribe((data: any) => {
                if (data.status) {
                    Swal.fire({
                        title: 'Libro Diario',
                        icon: 'success',
                        text: data.message,
                    });
                    this.obtenerLibrosDiarios(10, 0, this.mes, this.anio);
                } else {
                    Swal.fire({
                        title: 'Libro Diario',
                        icon: 'error',
                        text: data.message,
                    });
                }
            });

        //antes de editar comprobar que 
        this.libroDiarioSeleccionado = null;
    }

    cancelarEdicion() {
        this.libroDiarioSeleccionado = null;
    }


}
