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
    
  }

  generarPDF() {
    //valido que las fechas no sean nulas
    if(this.fechaInicio == null || this.fechaFin == null){
      return;
    }
    this.srvReportes.getReporteBalanceGeneral(this.informacionQuesera.int_cliente_id, this.fechaInicio, this.fechaFin)
    .subscribe((data: any) => {
      Swal.fire({
        title: 'Balance General',
        text: 'Reporte generado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      const pdfSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${data.body}`);
      this.dialog.open(VerPdfComponent, {
        width: '80%',
        data: { pdfSrc }
      });
      
    })

  }


}
