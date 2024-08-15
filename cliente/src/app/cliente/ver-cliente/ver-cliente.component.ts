import { Component, OnInit } from '@angular/core';
import { ClienteData } from 'src/app/core/models/cliente';
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
  styleUrls: ['./ver-cliente.component.css']
})
export class VerClienteComponent implements OnInit {
  clienteSelected!: ClienteData;
  constructor(
    private srvCliente : ClienteService
  ) {
    this.srvCliente.selectClienteSeleccionado$.subscribe((cliente: any) => {
      this.clienteSelected = cliente;
    });
  }

  ngOnInit() {
  }
  cerrarDetalles() {

  }

}
