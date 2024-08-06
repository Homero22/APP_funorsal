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
    this.perfilForm = this.fb.group({
      str_cliente_nombre: [this.informacionQuesera.str_cliente_nombre],
      str_cliente_correo: [this.informacionQuesera.str_cliente_correo],
      str_cliente_password: [this.informacionQuesera.str_cliente_password],
      str_cliente_telefono: [this.informacionQuesera.str_cliente_telefono],
      str_cliente_direccion: [this.informacionQuesera.str_cliente_direccion],
      str_cliente_ruc: [this.informacionQuesera.str_cliente_ruc],
      str_cliente_usuario: [this.informacionQuesera.str_cliente_usuario],


    });
  }

  constructor(public dialog: MatDialog,private fb: FormBuilder, public srvCliente: ClienteService) {
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
      console.log("Informacion Quesera",this.informacionQuesera);
    });
    this.srvCliente.selectIdClienteLogueado$.subscribe((id: any) => {
      this.idUsuario = id;
      console.log("ID",this.idUsuario);
    });
  }

  openModal(size: string): void {
    this.dialog.open(ModalComponent, {
      data: { size: size,
              contentType: 'editarCuenta'
       }
    });
  }

  onSave() {
    console.log("Click",this.perfilForm.value);
    this.srvCliente.actualizarCliente(this.idUsuario,this.perfilForm.value)
    console.log("ID",this.idUsuario);
    this.srvCliente.obtenerCliente(this.idUsuario)

  }

}
