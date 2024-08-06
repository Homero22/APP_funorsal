import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import config from "config/config";
import { Cliente, ClienteData, Body } from '../models/cliente';
import Swal from "sweetalert2";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
 export class ClienteService {

  constructor(private http: HttpClient) { }

  private destroy$ = new Subject<any>();
  private clientesPaginados$ = new Subject<Cliente>();
  public clienteLogueado!: ClienteData;

  private clienteLogueado$ = new BehaviorSubject<ClienteData>({} as ClienteData);
  private idClienteLogueado$ = new BehaviorSubject<number>(0);


  setClienteLogueado(cliente: ClienteData) {
    this.clienteLogueado$.next(cliente);
  }

  get selectClienteLogueado$() {
    return this.clienteLogueado$.asObservable();
  }

  setidClienteLogueado(id: number) {
    this.idClienteLogueado$.next(id);
  }

  get selectIdClienteLogueado$() {
    return this.idClienteLogueado$.asObservable();
  }

  isLogueado() {
    console.log('PASO 2: Verificando si el cliente está logueado');
    return !!localStorage.getItem('idCliente');
  }



  public idClienteLogueado!: number;

  //metodos de accesos

  setClientesPaginados(clientes: any) {
    this.clientesPaginados$.next(clientes);
  }

  get selectClientesPaginados$() {
    return this.clientesPaginados$.asObservable();
  }

  guardarIdClienteLogueado(idCliente: any) {
    console.log('Guardando id del cliente logueado', idCliente);
    localStorage.setItem('idCliente', idCliente.toString());
    this.obtenerCliente(idCliente);
  }


  //Rutas de la API
  private urlApi_clientes : string = config.URL_API_BASE + 'clientes';


  //Obtener todos los clientes
  getClientes() {
    return this.http.get<Cliente>(this.urlApi_clientes);
  }

  //Obtener clientes paginados
  getClientesPaginados(page: number, limit: number) {
    let params = new HttpParams()
    .set('page', page)
    .set('size', limit);
    return this.http.get(this.urlApi_clientes, {params});
  }

  //Obtener un cliente
  getCliente(id: any) {
    return this.http.get(this.urlApi_clientes + '/' + id);
  }

  //Crear un cliente
  createCliente(cliente: any) {
    return this.http.post(this.urlApi_clientes, cliente);
  }

  //Actualizar un cliente
  updateCliente(id: number, cliente: any) {
    return this.http.put(this.urlApi_clientes + '/' + id, cliente);
  }

  //Eliminar un cliente

  deleteCliente(id: string) {
    return this.http.delete(this.urlApi_clientes + '/' + id);
  }

  //funcion general para obtener los clientes

  obtenerClientesPaginados(page: number, limit: number) {
    console.log('Obteniendo clientes paginados', page, limit);
    this.getClientesPaginados(page, limit)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        this.setClientesPaginados(data);
      },
      error: (error: any) => {
        Swal.fire('Error', error.message, 'error');
      }
    })
  }

  //funcion general para actualizar un cliente
  actualizarCliente(id: number, cliente: any) {
    console.log('Actualizando cliente', id, cliente);
    this.updateCliente(id, cliente)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        if(data.status){
          console.log('Cliente actualizado!!1', data);
          Swal.fire({
            title: 'Datos actualizados',
            text: 'Se ha actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }else{
          Swal.fire({
            title: 'Error al actualizar',
            text: 'No se ha podido actualizar',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar cliente', error);
      }
    });
  }

  //funcion para obtener la informacion de un cliente
  obtenerCliente(id: any) {
    this.getCliente(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        this.setClienteLogueado(data.body);
      },
      error: (error: any) => {
        console.error('Error al obtener cliente', error);
      }
    });
  }




 }
