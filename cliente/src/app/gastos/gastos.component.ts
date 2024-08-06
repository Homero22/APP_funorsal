import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteService } from '../core/services/cliente.service';
export interface Gastos {
  int_transaccion_id: number;
  str_transaccion_nombre: string;
  str_transaccion_codigo: string;
  int_cuenta_id: number;
  dc_detalle_transaccion_cantidad: number;
  dt_fecha_creacion: string;
}

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit, AfterViewInit {

  constructor(
    public srvCliente: ClienteService
  ) {
    this.dataSource = new MatTableDataSource(this.ingresos);
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      console.log("Informacion Quesera",this.informacionQuesera);
    });
  }
  informacionQuesera!: any;
  currentComponent: string = 'registroIngreso';
  dataSource: MatTableDataSource<Gastos>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['int_transaccion_id', 'str_transaccion_nombre', 'dc_detalle_transaccion_cantidad', 'dt_fecha_creacion','acciones'];

  ingresos = [
    {int_transaccion_id: 1, str_transaccion_nombre: 'Gasto operaciones', str_transaccion_codigo: 'I1', int_cuenta_id: 5, dc_detalle_transaccion_cantidad: 10, dt_fecha_creacion : '2021-09-01'},
    {int_transaccion_id: 2, str_transaccion_nombre: 'FUNCONQUERUCOM', str_transaccion_codigo: 'I2', int_cuenta_id: 5, dc_detalle_transaccion_cantidad: 20, dt_fecha_creacion : '2021-09-02'},
    {int_transaccion_id: 3, str_transaccion_nombre: 'AMBROCIO YANCHALIQUIN', str_transaccion_codigo: 'I3', int_cuenta_id: 5, dc_detalle_transaccion_cantidad: 30, dt_fecha_creacion : '2021-09-03'},
    {int_transaccion_id: 4, str_transaccion_nombre: 'NUÑEZ DARWIN', str_transaccion_codigo: 'I4', int_cuenta_id: 5, dc_detalle_transaccion_cantidad: 40, dt_fecha_creacion : '2021-09-04'},
  ];


  ngOnInit() {

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

  verDetalle(transaccion: any){
    console.log(transaccion);
  }


}
