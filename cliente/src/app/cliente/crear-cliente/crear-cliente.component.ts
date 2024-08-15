import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClienteData } from 'src/app/core/models/cliente';
import { ClienteService } from 'src/app/core/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {
 clienteForm!: FormGroup;
 private destroy$ = new Subject<any>();

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

  constructor(
    private fb: FormBuilder,
    private srvCliente: ClienteService,
    private router:Router

  ) {
    this.clienteForm = this.fb.group({
      str_cliente_nombre: ['', Validators.required],
      str_cliente_ruc: ['', Validators.required],
      str_cliente_correo: ['', [Validators.required, Validators.email]],
      str_cliente_telefono: ['', Validators.required],
      str_cliente_direccion: ['', Validators.required],
      str_cliente_password: ['', Validators.required]
    });
   }

  ngOnInit() {
  }

  crearCliente(){
    if (this.clienteForm.valid) {
      this.srvCliente.createCliente(this.clienteForm.value).subscribe(() => {
        this.router.navigate(['/mostrar-clientes']);
      });
    }

  }
  addCliente() {
    this.srvCliente.createCliente(this.newCliente)
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
        })
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




}
