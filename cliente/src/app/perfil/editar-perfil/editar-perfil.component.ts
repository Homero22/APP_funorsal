import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClienteService } from 'src/app/core/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  hidePassword = true; // Variable para controlar la visibilidad de la contraseña


  clienteSeleccionado: any;

  constructor(
    private srvCliente : ClienteService
  ) {
    this.srvCliente.selectClienteSeleccionado$.subscribe((cliente: any) => {
      this.clienteSeleccionado = cliente;
    });
   }

  ngOnInit() {
  }



  editarCuenta() {
    Swal.fire({
      title: '¿Está seguro de editar su cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Editar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.actualizarCliente(this.clienteSeleccionado.int_cliente_id, this.clienteSeleccionado);
      }
    })

  }

  cancelarEdicion() {
  }

}
