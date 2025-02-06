import { Component, OnInit } from '@angular/core';
import { CuentasService } from 'src/app/core/services/cuentas.service';
import { Cuenta } from '../plan-cuentas.component';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacionCuenta',
  templateUrl: './informacionCuenta.component.html',
  styleUrls: ['./informacionCuenta.component.css']
})
export class InformacionCuentaComponent implements OnInit {
  infoCuentaSeleccionada!: Cuenta;
  isLoading = true;
  fechaInicio!: Date;
  fechaFin!: Date;
  private destroy$ = new Subject<any>();
  mostrarFormulario: boolean = false;
  buscarSaldof: boolean = false;

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
  toggleEditarSaldo() {
    this.editarSaldo = !this.editarSaldo;
}
toggleBuscarSaldo() {
    this.buscarSaldof = !this.buscarSaldof;
}


  data!: any;
  isModalOpen = false;
  selectedMovimiento: any;

  saldoForm: FormGroup = new FormGroup({});

  constructor(
    private srvCuentas: CuentasService,
    private fb: FormBuilder,
  ) { 
    this.saldoForm = this.fb.group({
        int_cuenta_id: ['', Validators.required],
        mes: ['', Validators.required],
        anio: ['', Validators.required],
        dec_saldo_deudora: ['', Validators.required],
        dec_saldo_acreedora: ['', Validators.required],
        dec_saldo_anterior_debito: ['', Validators.required],
        dec_saldo_anterior_credito: ['', Validators.required]
      });

        this.buscarSaldoForm = this.fb.group({
            mes: ['', Validators.required],
            anio: ['', Validators.required],
            int_cuenta_id: ['', Validators.required]
        });
  }
  agregarSaldo() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas agregar el saldo mensual?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            this.agregarSaldoMensual();
        }
    });

  }
  resetForm() {
    this.saldoForm.reset();
  }
  agregarSaldoMensual() {
    if (this.saldoForm.valid) {
        this.srvCuentas.agregarSaldoMensual(this.saldoForm.value).subscribe({
          next: response => {
            if(response.status){
                Swal.fire('Saldo agregado', 'Se ha agregado el saldo mensual correctamente', 'success');
                this.obtenerDataCuenta();
                this.toggleFormulario();
                this.resetForm();
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                })
            }
            
          },
          error: error => {
            console.error('Error al agregar saldo:', error);
          }
        });
      }
    }

  ngOnInit(): void {
    this.srvCuentas.selectCuentaSeleccionada.subscribe((cuenta: Cuenta) => {
      this.infoCuentaSeleccionada = cuenta;
    });
    this.obtenerFechaActual();
    this.obtenerDataCuenta();
  }

  obtenerDataCuenta() {
    this.srvCuentas
      .obtenerInformacionCuenta(this.infoCuentaSeleccionada.int_cuenta_id, this.fechaInicio, this.fechaFin)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cuentas: any) => {
        this.data = cuentas;
        //agrego el id de la cuenta en el formulario
        this.saldoForm.patchValue({
          int_cuenta_id: this.infoCuentaSeleccionada.int_cuenta_id
        });
        this.buscarSaldoForm.patchValue({
            int_cuenta_id: this.infoCuentaSeleccionada.int_cuenta_id
        });

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      });
  }

  obtenerFechaActual() {
    this.fechaFin = new Date();
    let fechaInicio = new Date(this.fechaFin);
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    this.fechaInicio = fechaInicio;
  }

  openModal(movimiento: any): void {
    this.selectedMovimiento = movimiento;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


  editarSaldo: boolean = false;
  mesEditar : number = 0;
  anioEditar : number = 0;
  idCuentaEditar : number = 0;
  int_saldo_mensual_cuenta_id: number = 0;

  editarSaldoF() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas editar el saldo mensual?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        cancelButtonText: 'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            this.srvCuentas.editarSaldoMensual(this.int_saldo_mensual_cuenta_id, this.saldoForm.value).subscribe({
                next: response => {
                    if(response.status){
                        Swal.fire('Saldo editado', 'Se ha editado el saldo mensual correctamente', 'success');
                        this.obtenerDataCuenta();
                        this.toggleEditarSaldo();
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.message,
                        })
                    }
                },
                error: error => {
                    console.error('Error al editar saldo:', error);
                }
            });
            
        }
    });
  }

  buscarSaldoForm: FormGroup = new FormGroup({});

    buscarSaldo() {
        if (this.buscarSaldoForm.valid) {
            this.srvCuentas.obtenerSaldoMensual(this.buscarSaldoForm.value).subscribe({
            next: response => {
                if(response.status){
                    console.log(response.body);
                    this.int_saldo_mensual_cuenta_id = response.body.int_saldo_mensual_cuenta_id;
                    this.saldoForm.patchValue({
                        int_cuenta_id: response.body.int_cuenta_id,
                        mes: response.body.mes,
                        anio: response.body.anio,
                        dec_saldo_deudora: response.body.dec_saldo_deudora,
                        dec_saldo_acreedora: response.body.dec_saldo_acreedora,
                        dec_saldo_anterior_debito: response.body.dec_saldo_anterior_debito,
                        dec_saldo_anterior_credito: response.body.dec_saldo_anterior_credito
                    });
                    this.mesEditar = response.body.mes;
                    this.anioEditar = response.body.anio;
                    this.idCuentaEditar = response.body.int_cuenta_id;
                   
                    this.toggleBuscarSaldo();
                    this.toggleEditarSaldo();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.message,
                    })
                }
                
            },
            error: error => {
                console.error('Error al buscar saldo:', error);
            }
            });
        }
    }

}




