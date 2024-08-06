
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CuentasService } from '../core/services/cuentas.service';
import { Body } from '../core/models/cliente';
import { Subject, take, takeUntil } from 'rxjs';

export interface Cuenta {
  int_cuenta_id: number;
  str_cuenta_nombre: string;
  str_cuenta_codigo: string;
  int_cuenta_padre_id: number | null;
}

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.css'],
})
export class PlanCuentasComponent implements AfterViewInit {
  displayedColumns: string[] = ['codigo', 'nombre', 'acciones'];
  displayedColumns2: string[] = ['codigo', 'nombre', 'acciones'];
  clickedRows = new Set<any>();
  cuentas: Cuenta[] = [];
  cuentasHijasByPadreId: Cuenta[] = [];
  hoveredCuenta: any = null;
  dataSource: MatTableDataSource<Cuenta>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  cuentaSeleccionada!: Cuenta;

  cuentasAux: Cuenta[] = [];

  idCliente = 1;
  private destroy$ = new Subject<any>();
  @ViewChild('cuentasHijasSection', { static: false }) cuentasHijasSection!: ElementRef;
  verCuentasHijasBandera: boolean;

  dataSourceHijas: MatTableDataSource<Cuenta>;
  cuentaPadre!:string;

  tituloTabla = 'Cuentas Principales';

  tituloBotonVer = 'Ver Todas las Cuentas';

  cuentasHijas: Cuenta[] = [];

  agregar!: boolean;
  openModal(size: string,titulo:string,tipo:string): void {
    this.dialog.open(ModalComponent, {
      data: { size: size,
              contentType: tipo,
              tituloModal: titulo

       }
    });
  }

  cuentasConPadreIdIngresada(cuenta: Cuenta){
    return this.cuentas.filter(c=> c.int_cuenta_padre_id === cuenta.int_cuenta_id);
  }

  agregarCuenta(cuenta:any){

    let cuentasHijasDirectas = this.cuentasConPadreIdIngresada(cuenta);
    this.srvCuentas.setCuentasHijasByPadreId(cuentasHijasDirectas);
    this.srvCuentas.setCuentaSeleccionada(cuenta);
    this.openModal('large','Agregar Cuenta', 'agregarCuenta');
  }

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    private srvCuentas: CuentasService
  ) {
    this.sort = new MatSort();

    this.obtenerCuentasDelCliente();
    this.srvCuentas.getCuentas$
    .pipe(takeUntil(this.destroy$))
    .subscribe((cuentas: any) => {
      this.cuentas = cuentas;
      this.actualizarDataSource();
    });

    this.agregar = false;
    this.verCuentasHijasBandera = false;

    const cuentasPrincipales = this.obtenerCuentasPrincipales();
    this.dataSource = new MatTableDataSource(cuentasPrincipales);
    this.obtenerCuentasHijasByPadreId(0);
    this.dataSourceHijas = new MatTableDataSource(this.cuentasHijasByPadreId);


  }

  obtenerCuentasDelCliente(){
    this.srvCuentas.obtenerCuentasDelCliente(this.idCliente);
  }

  ordenarCuentas(){
    this.cuentas.sort((a, b) => (a.str_cuenta_codigo > b.str_cuenta_codigo) ? 1 : -1);
  }


  obtenerCuentasHijasByPadreId(padreId: number) {

  //  this.cuentasHijasByPadreId = this.cuentas.filter(cuenta => cuenta.int_cuenta_padre_id === padreId);

  //se debe encontrar TODAS las cuentas que son a partir de un padre es decir si el padre es 2 , se debe obtener recurvisamente
  //todas las cuentas 2.1, 2.1.1, 2.2, 2.2.1, 2.2.1.2 etc........
  //para ello se debe hacer un recorrido de las cuentas y verificar si el padre es igual al padreId
  //si es asi se debe agregar a la lista de cuentas hijas

    this.cuentasHijasByPadreId = [];
    this.funcionRecursiva(padreId);
   this.dataSourceHijas = new MatTableDataSource(this.cuentasHijasByPadreId);
  }

  obtenerCuentasHijasByPadreId2(padreId: number) {
    this.cuentasAux = [];
    this.funcionRecursiva2(padreId);
  }

  obtenerCuentasMismaJerarquia(cuenta: Cuenta){
    this.cuentasAux = [];
    this.cuentasAux = this.cuentas.filter(c=>
      c.int_cuenta_padre_id === cuenta.int_cuenta_padre_id
    )

  }

  funcionRecursiva2(padreId: number){
    this.cuentas.forEach(cuenta => {
      if (cuenta.int_cuenta_padre_id === padreId) {
        this.cuentasAux.push(cuenta);
        this.funcionRecursiva2(cuenta.int_cuenta_id);
      }
    }
    );
  }

  funcionRecursiva(padreId: number){
    this.cuentas.forEach(cuenta => {
      if (cuenta.int_cuenta_padre_id === padreId) {
        this.cuentasHijasByPadreId.push(cuenta);
        this.funcionRecursiva(cuenta.int_cuenta_id);
      }
    }
    );
  }

  verCuentas(){
    if(this.tituloBotonVer === 'Ver Cuentas Principales'){
      this.tituloBotonVer = 'Ver Todas las Cuentas';
      this.tituloTabla = 'Cuentas Principales';
      this.actualizarDataSource();
    }else{
      this.tituloBotonVer = 'Ver Cuentas Principales';
      this.tituloTabla = 'Todas las Cuentas';
      this.ordenarCuentas();
      this.dataSource.data = this.cuentas;
    }
    this.ngAfterViewInit();
  }

  editarCuenta(cuenta: any) {
    console.log('Editando cuenta:', cuenta);
    this.srvCuentas.setCuentaSeleccionada(cuenta);
    this.openModal('large','Editar Cuenta','editarCuenta');
  }

  eliminarCuenta(cuenta: any) {
    console.log('Eliminando cuenta:', cuenta);
    // this.cuentas = this.cuentas.filter(c => c.int_cuenta_id !== cuenta.int_cuenta_id);
    // this.actualizarDataSource();
  }
  verCuentasHijas(cuenta: any) {
    this.obtenerCuentasHijasByPadreId(cuenta.int_cuenta_id);
    this.cuentaPadre = cuenta.str_cuenta_nombre;
    this.verCuentasHijasBandera = true;
    setTimeout(() => {
      this.scrollToCuentasHijas();
    }, 100); // Dar tiempo para que el componente hijo se renderice
  }
  scrollToCuentasHijas() {
    console.log('Scrolling to cuentas hijas');
    if (this.cuentasHijasSection) {
      this.cuentasHijasSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  cerrarCuentasHijas() {
    this.verCuentasHijasBandera = false;
  }

  imprimirDatosCuenta(cuenta: any) {
    console.log('Datos de la cuenta:', cuenta);
  }

  obtenerCuentasPrincipales() {
    return this.cuentas.filter(cuenta => cuenta.int_cuenta_padre_id === null);
  }

  onMouseOver(cuenta: any) {
    this.hoveredCuenta = cuenta;
  }

  onMouseOut() {
    this.hoveredCuenta = null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceHijas.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceHijas.paginator) {
      this.dataSourceHijas.paginator.firstPage();
    }
  }



  agregarC(){
    this.agregar = true;

  }

  actualizarDataSource() {
    this.dataSource.data = this.obtenerCuentasPrincipales();
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}




