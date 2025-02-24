import { Component, OnInit } from '@angular/core';
import { Cliente, ClienteData } from '../core/models/cliente';
import { LoginService } from '../core/services/login.service';
import { ClienteService } from '../core/services/cliente.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {


  constructor(
    private srvLogin: LoginService,
    private srvCliente: ClienteService
  ) { }
  informacionQuesera!: any;
  currentComponent: string = 'Plan de Cuentas';
  cuentas!:any;
  isSuperAdmin: boolean = false;
listadoClientes: ClienteData[] = [];
clienteSeleccionado: Cliente | null = null;
quesera : string = ''
selectedQuesera! : ClienteData


  ngOnInit() {
   
    this.isSuperAdmin = this.srvLogin.isSuperAdmin();
    if(this.isSuperAdmin){
        this.listadoClientes = this.srvCliente.allClientesService
        this.selectedQuesera = this.listadoClientes[0]
      
    }else{
        this.llenarInformacionQuesera();
    }
  }
  onClienteChange(event : any){
    this.quesera = event.value.str_cliente_nombre
    this.selectedQuesera = event.value
}
  llenarInformacionQuesera(){
    this.informacionQuesera = {
      nombre: "Cañitas",
      direccion: "Calle 123",
      telefono: "1234567890",
    }

  }

  showComponent(component: string) {
    this.currentComponent = component;
  }

}
