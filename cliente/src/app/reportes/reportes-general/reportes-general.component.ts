import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { PdfService } from 'src/app/core/services/reportes.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { VerPdfComponent } from 'src/app/ver-pdf/ver-pdf.component';	
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reportes-general',
  templateUrl: './reportes-general.component.html',
  styleUrls: ['./reportes-general.component.css']
})
export class ReportesGeneralComponent implements OnInit {

  fechaInicio!: Date;
  fechaFin!: Date;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  selectedYear!: number;
  selectedMonth!: string;

  informacionQuesera!: any;

  constructor(
    private srvCliente: ClienteService,
    private srvReportes: PdfService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { 
    this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
      this.informacionQuesera = cliente;
    });
  }

  ngOnInit() {
    this.populateYears();
    this.selectedYear = this.currentYear;
  }
  populateYears(): void {
    for (let i = this.currentYear; i >= this.currentYear - 10; i--) {
      this.years.push(i);
    }
  }
  selectMonth(month: string): void {
    this.selectedMonth = month;
    let fechaInicio = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), 1);
    let fechaFin = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth) + 1, 0);
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;

    this.srvReportes.getReporteBalanceGeneral(this.informacionQuesera.int_cliente_id, this.fechaInicio, this.fechaFin)
    .subscribe((data: any) => {
      if(data.status){
        const pdfSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${data.body}`);
        this.dialog.open(VerPdfComponent, {
          width: '80%',
          data: { pdfSrc }
        });
      }else{
        Swal.fire({
          title: 'Reporte de Balance General',
          text: 'No se encontraron registros',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }

    })

  }


  generarPDF() {
    //valido que las fechas no sean nulas
    if(this.fechaInicio == null || this.fechaFin == null){
      return;
    }
    this.srvReportes.getReporteBalanceGeneral(this.informacionQuesera.int_cliente_id, this.fechaInicio, this.fechaFin)
    .subscribe((data: any) => {
      if(data.status){
      const pdfSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${data.body}`);
      this.dialog.open(VerPdfComponent, {
        width: '80%',
        data: { pdfSrc }
      });
    }else{
      Swal.fire({
        title: 'Reporte de Balance General',
        text: 'No se encontraron registros',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
      
    })

  }


}
