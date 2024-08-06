import { Component, HostListener, OnInit } from '@angular/core';
import { ClienteService } from '../core/services/cliente.service';
import {  ClienteData, Cliente } from '../core/models/cliente';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {


  constructor(private clienteService: ClienteService) { }
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
        console.log(this.clientes);
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
    console.log('Next page');
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
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  closeModal2() {
    this.isModalOpen2 = false;
  }
  openModal2(cliente:any) {
    this.isModalOpen2 = true;
    this.clienteSelected = cliente;
  }
  closeEditModal(){
    this.isEditModalOpen = false;
  }
  editCliente(cliente: any) {
    this.clienteSelected = cliente;
    this.isEditModalOpen = true;
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

  editarCliente() {
    console.log('Editando cliente', this.clienteSelected);
    this.clienteService.updateCliente(this.clienteSelected.int_cliente_id, this.clienteSelected)
    .subscribe({
      next: (data: any) => {
        console.log('Cliente editado', data);
        if(data.status){
          Swal.fire({
            title: 'Cliente editado',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: data.message,
            icon: 'error'
          });
        }
        this.obtenerClientesPaginados();
        this.seleccionarDatos();
        this.closeEditModal();
      },
      error: (error: any) => {
        console.log('Error al editar cliente', error);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error'
        });
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModal();
    this.closeModal2();
  }

}
