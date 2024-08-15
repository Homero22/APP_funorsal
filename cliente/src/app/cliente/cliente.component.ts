import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { ClienteService } from '../core/services/cliente.service';
import {  ClienteData, Cliente } from '../core/models/cliente';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {


  constructor(private clienteService: ClienteService,public dialog: MatDialog) { }
  private destroy$ = new Subject<any>();


  clientes!: ClienteData[];
  clienteSelected = {
    int_cliente_id: 0,
    str_cliente_nombre: '',
    str_cliente_ruc: '',
    str_cliente_correo: '',
    str_cliente_telefono: '',
    str_cliente_direccion: '',
    str_cliente_password: '',
    str_cliente_usuario: ''
  };

  paginatedClientes: ClienteData[] = [];
  currentPage = 1;
  itemsPerPage: number = 5;
  totalPages!: number;
  isModalOpen = false;
  isModalOpen2 = false;
  isEditModalOpen = false;
  totalClientes!: number;

  newCliente: ClienteData = {
    int_cliente_id: 0,
    str_cliente_nombre: '',
    str_cliente_ruc: '',
    str_cliente_correo: '',
    str_cliente_telefono: '',
    str_cliente_direccion: '',
    str_cliente_password: '',
    str_cliente_usuario: ''
  };



  ngOnInit() {
    this.obtenerClientesPaginados();
    this.seleccionarDatos();
  }

  obtenerClientesPaginados(){
    this.clienteService.obtenerClientesPaginados(this.currentPage, this.itemsPerPage)
    this.seleccionarDatos();
  }

  seleccionarDatos(){
    this.clienteService.selectClientesPaginados$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clientes: Cliente) => {
        this.clientes = clientes.body.rows;

        this.paginatedClientes = clientes.body.rows;
        this.totalClientes = clientes.body.count;
        this.totalPages = (Math.ceil(this.totalClientes / this.itemsPerPage));
      });
  }

  ngOnDestroy() {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  nextPage() {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  paginate() {
    this.updatePaginatedClientes();
  }

  openModal() {
    //this.isModalOpen = true;
    this.openModalG('large','crearCliente');
  }

  closeModal() {
    this.isModalOpen = false;
  }
  closeModal2() {
    this.isModalOpen2 = false;
  }
  openModal2(cliente:any) {

    this.clienteService.setClienteSeleccionado(cliente);
    this.openModalG('large','verCliente');
  }
  closeEditModal(){
    this.isEditModalOpen = false;
  }
  editCliente(cliente: any) {
    this.clienteService.setClienteSeleccionado(cliente);
    this.openModalG('large','editarCliente');


  }
  deleteCliente(cliente: any) {
  }

  updatePaginatedClientes() {
    this.obtenerClientesPaginados();
    this.seleccionarDatos();
  }
  onSave(){

  }

  agregarCliente() {
    this.clienteService.createCliente(this.newCliente)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        if(!data.status){
          Swal.fire({
            title: 'Error',
            text: data.message,
            icon: 'error'
          });
          return;
        }
        Swal.fire({
          title: 'Cliente agregado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        if (this.clientes.length < this.itemsPerPage) {
          this.clientes.push(data);
        }
        this.obtenerClientesPaginados();
        this.seleccionarDatos();
        this.newCliente = {
          int_cliente_id: 0,
          str_cliente_nombre: '',
          str_cliente_ruc: '',
          str_cliente_correo: '',
          str_cliente_telefono: '',
          str_cliente_direccion: '',
          str_cliente_password: '',
          str_cliente_usuario: ''
        };
        this.closeModal();
      },
      error: (error: any) => {
        console.log('Error al agregar cliente', error);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error'

        })
      }
    });
  }

  openModalG(size: string, contentType:string): void {
    this.dialog.open(ModalComponent, {
      data: { size: size,
              contentType: contentType
       }
    }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.updatePaginatedClientes();
    }
    );
  }

  addCliente() {

    if (this.newCliente.str_cliente_nombre && this.newCliente.str_cliente_direccion && this.newCliente.str_cliente_telefono) {
      this.agregarCliente();
      this.updatePaginatedClientes();
      this.newCliente = {
        int_cliente_id: 0,
        str_cliente_nombre: '',
        str_cliente_ruc: '',
        str_cliente_correo: '',
        str_cliente_telefono: '',
        str_cliente_direccion: '',
        str_cliente_password: '',
        str_cliente_usuario: ''
      };
      this.closeModal();
    }
  }



  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModal();
    this.closeModal2();
  }

}
