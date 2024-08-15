import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteService } from '../core/services/cliente.service';

export interface Ingreso {
  int_transaccion_id: number;
  str_transaccion_nombre: string;
  str_transaccion_codigo: string;
  int_cuenta_id: number;
  dc_detalle_transaccion_cantidad: number;
  dt_fecha_creacion: string;
}


@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit, AfterViewInit {

  constructor(
    public srvCliente: ClienteService
  ) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;

    });
    this.dataSource = new MatTableDataSource(this.ingresos);
   }
  informacionQuesera!: any;
  currentComponent: string = 'registroIngreso';
  dataSource: MatTableDataSource<Ingreso>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['int_transaccion_id', 'str_transaccion_nombre', 'dc_detalle_transaccion_cantidad', 'dt_fecha_creacion','acciones'];

  ingresos = [
    {int_transaccion_id: 5, str_transaccion_nombre: 'venta COMEDOR MEDITERRANEO', str_transaccion_codigo: 'I1', int_cuenta_id: 6, dc_detalle_transaccion_cantidad: 25.3, dt_fecha_creacion : '2021-09-01'},
    {int_transaccion_id: 6, str_transaccion_nombre: 'venta FUNCONQUERUCOM', str_transaccion_codigo: 'I2', int_cuenta_id: 6, dc_detalle_transaccion_cantidad: 40.80, dt_fecha_creacion : '2021-09-02'},
    {int_transaccion_id: 7, str_transaccion_nombre: 'venta AMBROCIO YANCHALIQUIN', str_transaccion_codigo: 'I3', int_cuenta_id: 6, dc_detalle_transaccion_cantidad: 85.88, dt_fecha_creacion : '2021-09-03'},
    {int_transaccion_id: 8, str_transaccion_nombre: 'venta NUÑEZ DARWIN', str_transaccion_codigo: 'I4', int_cuenta_id: 6, dc_detalle_transaccion_cantidad: 50.22, dt_fecha_creacion : '2021-09-04'},
  ];


  ngOnInit() {

  }

  verDetalle(transaccion: any){

  }


  showComponent(component: string) {
    this.currentComponent = component;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  actualizarDataSource() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
