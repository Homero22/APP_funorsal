import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ClienteData } from 'src/app/core/models/cliente';
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {
 clienteForm!: FormGroup;

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

}
