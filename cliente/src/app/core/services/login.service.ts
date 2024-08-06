import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import config from "config/config";
import { Observable } from "rxjs";
import { ClienteService } from "./cliente.service";

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient, private srvCliente:ClienteService) { }

  //Rutas de la API
  private urlApi_login : string = config.URL_API_BASE + 'login';

  logueado: boolean = false;
  public idClienteLogueado!: number;

  setClienteLogueado(idCliente: number) {
    this.idClienteLogueado = idCliente;
    this.srvCliente.setidClienteLogueado(idCliente);
  }



  //Inicio de sesión
  login(usuario: string, contrasena: string) {
    return this.http.post(this.urlApi_login, {usuario, contrasena});
  }

  //creo un observable para saber si el cliente está logueado
  selectClienteLogueado$ = new Observable((observer: any) => {
    observer.next(localStorage.getItem('idCliente'));
  });

  //funcion para retornar true si el cliente está logueado
  isLogueado() {
    return !!localStorage.getItem('idCliente');
  }

  //Función para cerrar sesión
  logout() {
    this.idClienteLogueado = 0;
    localStorage.removeItem('idCliente');
  }

  //funcion para guardar el id del cliente logueado en localStorage
  guardarIdClienteLogueado(idCliente: any) {
    localStorage.setItem('idCliente', idCliente.toString());
    console.log('PASO 1', idCliente);
  }



}
