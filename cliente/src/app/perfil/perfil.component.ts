import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModalComponent } from '../modal/modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClienteService } from '../core/services/cliente.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  informacionQuesera!: any;
  idUsuario!: number;
  perfilForm!: FormGroup;
  private destroy$ = new Subject<any>();

  ngOnInit() {
    this.llenarFormulario();
  }

  llenarFormulario() {
    this.perfilForm = this.fb.group({
      str_cliente_nombre: [{ value: this.informacionQuesera.str_cliente_nombre, disabled: true }],
      str_cliente_correo: [{ value: this.informacionQuesera.str_cliente_correo, disabled: true }],
      str_cliente_password: [{ value: this.informacionQuesera.str_cliente_password, disabled: true }],
      str_cliente_telefono: [{ value: this.informacionQuesera.str_cliente_telefono, disabled: true }],
      str_cliente_direccion: [{ value: this.informacionQuesera.str_cliente_direccion, disabled: true }],
      str_cliente_ruc: [{ value: this.informacionQuesera.str_cliente_ruc, disabled: true }],
      str_cliente_usuario: [{ value: this.informacionQuesera.str_cliente_usuario, disabled: true }],
    });

  }


  constructor(public dialog: MatDialog,private fb: FormBuilder, public srvCliente: ClienteService) {

    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      this.llenarFormulario();
    });
    this.srvCliente.selectIdClienteLogueado$.subscribe((id: any) => {
      this.idUsuario = id;

    });
  }

  openModal(size: string): void {
    this.dialog.open(ModalComponent, {
      data: { size: size,
              contentType: 'editarPerfil'
       }
    });
  }

  onEdit() {

   this.srvCliente.setClienteSeleccionado(this.informacionQuesera);
    this.openModal('large');

  }

}
