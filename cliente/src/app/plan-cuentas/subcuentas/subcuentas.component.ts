import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { CuentasService } from 'src/app/core/services/cuentas.service';
import { ModalComponent } from 'src/app/modal/modal.component';
import Swal from 'sweetalert2';
export interface Cuenta {
  int_cuenta_id: number;
  nombre: string;
  codigo: string;
  int_cuenta_padre_id: number | null;
}

@Component({
  selector: 'app-subcuentas',
  templateUrl: './subcuentas.component.html',
  styleUrls: ['./subcuentas.component.css']
})
export class SubcuentasComponent implements AfterViewInit, OnInit, OnChanges{
  @Input() cuentaPadre: string = '';
  @Input() cuentasHijas: any = [];

  private destroy$ = new Subject<any>();

  displayedColumns: string[] = ['codigo', 'nombre', 'acciones'];
  displayedColumns2: string[] = ['codigo', 'nombre', 'acciones'];
  clickedRows = new Set<any>();
  cuentas: Cuenta[] = [];
  cuentasHijasByPadreId: Cuenta[] = [];
  hoveredCuenta: any = null;
  dataSource: MatTableDataSource<Cuenta>;
  newCuenta: { nombre: string; codigo: string; int_cuenta_id: number; int_cuenta_padre_id: number | null } = { nombre: '', codigo: '', int_cuenta_id: 0, int_cuenta_padre_id: null };

  @ViewChild(MatPaginator) paginator2!: MatPaginator;

  informacionQuesera!: any;
  @ViewChild(MatSort) sort2: MatSort;

  @ViewChild('cuentasHijasSection', { static: false }) cuentasHijasSection!: ElementRef;
  verCuentasHijasBandera: boolean;

  dataSourceHijas: MatTableDataSource<Cuenta>;
  cuentaPadreNombre!:string;

  agregar!: boolean;

  constructor(
    private srvCuentas: CuentasService,
    public dialog: MatDialog,
    public srvCliente: ClienteService
  ) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      console.log("Informacion Quesera",this.informacionQuesera);
    });


    this.sort2 = new MatSort();

    this.agregar = false;
    this.verCuentasHijasBandera = false;
    //this.cuentas
    const cuentasPrincipales = this.obtenerCuentasPrincipales();
    this.dataSource = new MatTableDataSource(cuentasPrincipales);
    this.obtenerCuentasHijasByPadreId(0);
    this.dataSourceHijas = new MatTableDataSource(this.cuentasHijasByPadreId);


  }
  openModal(size: string, titulo: string, tipo: string): void {
    this.dialog.open(ModalComponent, {
      data: { size: size, contentType: tipo, tituloModal: titulo },
    });
  }

  ngOnInit(): void {
    this.actualizarCuentasHijas();

  }
  obtenerCuentasDelCliente() {
    this.srvCuentas.obtenerCuentasDelCliente(this.informacionQuesera.int_cliente_id);
    this.actualizarCuentasHijas();
    this.ngOnInit()
  }

  actualizarCuentasHijas(){
    this.dataSourceHijas = new MatTableDataSource(this.cuentasHijas);
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

  funcionRecursiva(padreId: number){
    this.cuentas.forEach(cuenta => {
      if (cuenta.int_cuenta_padre_id === padreId) {
        this.cuentasHijasByPadreId.push(cuenta);
        this.funcionRecursiva(cuenta.int_cuenta_id);
      }
    }
    );
  }




  verCuentasHijas(cuenta: any) {
    this.obtenerCuentasHijasByPadreId(cuenta.int_cuenta_id);
    this.cuentaPadreNombre = cuenta.str_cuenta_nombre;
    this.verCuentasHijasBandera = true;
  }

  cerrarCuentasHijas() {
    this.verCuentasHijasBandera = false;
  }
  eliminarCuenta(cuenta: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCuentas
          .eliminarCuenta(cuenta.int_cuenta_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data: any) => {
              if (data.status) {
                Swal.fire({
                  title: 'Cuenta eliminada',
                  text: 'Se ha eliminado correctamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                });
                this.dataSource._renderChangesSubscription;
              } else {
                Swal.fire({
                  title: 'Error al eliminar',
                  text: 'No se ha podido eliminar',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              }
            },
            error: (error: any) => {
              console.error('Error al eliminar cuenta', error);
            },
          });
      }
    });
  }

  editarCuenta(cuenta: any) {
    this.srvCuentas.setCuentaSeleccionada(cuenta);
    this.openModal('large', 'Editar Cuenta', 'editarCuenta');
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


  agregarCuentaPrincipal() {
    const nuevaCuenta = {
      int_cuenta_id: this.cuentas.length + 1,
      nombre: this.newCuenta.nombre,
      codigo: this.newCuenta.codigo,
      int_cuenta_padre_id: null,
    };
    this.cuentas.push(nuevaCuenta);
    this.actualizarDataSource();
    this.newCuenta = { nombre: '', codigo: '', int_cuenta_id: 0, int_cuenta_padre_id: null };
  }

  agregarC(){
    this.agregar = true;

  }

  actualizarDataSource() {

  }

  ngAfterViewInit() {

    this.dataSourceHijas.paginator = this.paginator2;
    this.dataSourceHijas.sort = this.sort2;
  }

  ngOnChanges() {
    this.cuentaPadreNombre = this.cuentaPadre;
    this.actualizarCuentasHijas();
    this.dataSourceHijas.paginator = this.paginator2;
    this.dataSourceHijas.sort = this.sort2;
  }



}
