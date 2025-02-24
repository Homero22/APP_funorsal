import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../core/services/cliente.service';
import { Cliente, ClienteData } from '../core/models/cliente';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
    clienteSeleccionado: Cliente | null = null;
    quesera : string = ''
    selectedQuesera! : ClienteData
    isSuperAdmin: boolean = false;
    listadoClientes: ClienteData[] = [];
    queseraD! : ClienteData

  constructor(
    public srvCliente: ClienteService,
        private srvLogin: LoginService,
        
  ) {
    this.isSuperAdmin = this.srvLogin.isSuperAdmin();
    if(this.isSuperAdmin){
        this.listadoClientes = this.srvCliente.allClientesService;
            this.queseraD = this.listadoClientes[0];
            this.dataCliente(this.queseraD.int_cliente_id, this.queseraD.str_cliente_nombre);
    }else{

        this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
          this.informacionQuesera = cliente;
            this.nombre = this.informacionQuesera.str_cliente_nombre
        });
    }
   }
   onClienteChange(event : any){
    this.quesera = event.value.str_cliente_nombre
    this.selectedQuesera = event.value
}
  informacionQuesera!: any;
  currentComponent: string = 'IngresosGastos';

  idCliente!: number;
  nombre!: string

  dataCliente(id: number, nombre : string) {
      this.idCliente = id;
      this.nombre = nombre
  }
  ngOnInit() {
    this.isSuperAdmin = this.srvLogin.isSuperAdmin();
    if(this.isSuperAdmin){
        this.listadoClientes = this.srvCliente.allClientesService
        this.selectedQuesera = this.listadoClientes[0]
    }

  }




  showComponent(component: string) {
    this.currentComponent = component;
  }

}
