import { Component } from '@angular/core';
import { LoginService } from './core/services/login.service';
import { ClienteService } from './core/services/cliente.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cliente';


  constructor(
    public loginService: LoginService,
    private srvCliente: ClienteService
  ) {
    console.log("App Component");
     if(this.srvCliente.isLogueado()){
      console.log("lo que retorna el isLogueado",this.srvCliente.isLogueado());
        console.log("Usuario Logueado SIIIIIIIIII");
        this.srvCliente.guardarIdClienteLogueado(localStorage.getItem('idCliente'));
     }
  }

}
