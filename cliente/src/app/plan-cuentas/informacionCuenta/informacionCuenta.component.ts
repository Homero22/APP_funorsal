import { Component, OnInit } from '@angular/core';
import { CuentasService } from 'src/app/core/services/cuentas.service';
import { Cuenta } from '../plan-cuentas.component';
import { Subject, takeUntil } from 'rxjs';

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

  data!: any;
  isModalOpen = false;
  selectedMovimiento: any;

  constructor(
    private srvCuentas: CuentasService,
  ) { }

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
}




