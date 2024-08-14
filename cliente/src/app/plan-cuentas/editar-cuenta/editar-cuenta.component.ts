import { Component, OnInit } from '@angular/core';
import { CuentasService } from 'src/app/core/services/cuentas.service';
import { Cuenta } from '../plan-cuentas.component';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { ModalComponent } from 'src/app/modal/modal.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {

  infoCuentaSeleccionada!: Cuenta
  private destroy$ = new Subject<any>();

  constructor(private srvCuenta: CuentasService,public dialogRef: MatDialogRef<ModalComponent>,) {


    this.srvCuenta.selectCuentaSeleccionada.subscribe((cuenta: Cuenta) => {
      this.infoCuentaSeleccionada = cuenta;
    });

   }

  ngOnInit() {

  }
  cancelarEdicion() {
    this.dialogRef.close();
  }

  guardarCambios() {
    console.log("Guardando cambios en cuenta", this.infoCuentaSeleccionada);
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los cambios realizados en la cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCuenta.actualizarCuenta(this.infoCuentaSeleccionada)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            if(data.status){
              Swal.fire({
                title: 'Datos actualizados',
                text: 'Se ha actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            }else{
              Swal.fire({
                title: 'Error al actualizar',
                text: 'No se ha podido actualizar',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (error: any) => {
            console.error('Error al actualizar cuenta', error);
          }
        });
      }
    })

  }



}
