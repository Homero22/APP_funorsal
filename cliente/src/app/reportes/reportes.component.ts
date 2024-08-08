import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../core/services/cliente.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(
    public srvCliente: ClienteService
  ) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      console.log("Informacion Quesera",this.informacionQuesera);
    });
   }
  informacionQuesera!: any;
  currentComponent: string = 'IngresosGastos';


  ngOnInit() {

  }




  showComponent(component: string) {
    this.currentComponent = component;
  }

}
