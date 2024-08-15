import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit {
  clienteSelected: any;

  constructor(
    private clienteService: ClienteService
  ) {
    this.clienteService.selectClienteSeleccionado$.subscribe((cliente) => {
      this.clienteSelected = cliente;
    });
   }

  ngOnInit() {
  }

  editarCliente(){
  }
  onSave(){
    this.clienteService.updateCliente(this.clienteSelected.int_cliente_id, this.clienteSelected)
    .subscribe({
      next: (data: any) => {
        if(data.status){
          Swal.fire({
            title: 'Datos actualizados',
            icon: 'success',
            showConfirmButton: true
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: data.message,
            icon: 'error'
          });
        }
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

}
