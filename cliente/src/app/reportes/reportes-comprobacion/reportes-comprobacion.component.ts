import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ClienteService } from "src/app/core/services/cliente.service";
import { PdfService } from "src/app/core/services/reportes.service";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { VerPdfComponent } from "src/app/ver-pdf/ver-pdf.component";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ClienteData } from "src/app/core/models/cliente";
import { LoginService } from "src/app/core/services/login.service";
@Component({
    selector: "app-reportes-comprobacion",
    templateUrl: "./reportes-comprobacion.component.html",
    styleUrls: ["./reportes-comprobacion.component.css"],
})
export class ReportesComprobacionComponent implements OnInit {
    @Input() quesera!: ClienteData;
    fechaInicio!: Date;
    fechaFin!: Date;
    currentYear: number = new Date().getFullYear();
    years: number[] = [];
    months: string[] = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    listadoClientes: ClienteData[] = [];
    selectedYear!: number;
    selectedMonth!: string;

    informacionQuesera!: any;
    isSuperAdmin: boolean = false;

    constructor(
        private srvCliente: ClienteService,
        private srvReportes: PdfService,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private srvLogin: LoginService
    ) {
        this.isSuperAdmin = this.srvLogin.isSuperAdmin();
        if (this.isSuperAdmin) {
            this.listadoClientes = this.srvCliente.allClientesService;
            this.quesera = this.listadoClientes[0];
            this.dataCliente(this.quesera.int_cliente_id, this.quesera.str_cliente_nombre);
        } else {
            this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
                this.informacionQuesera = cliente;
                this.dataCliente(this.informacionQuesera.int_cliente_id,this.informacionQuesera.str_cliente_nombre );
            });
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes["quesera"] && changes["quesera"].currentValue) {
            console.log("Nuevo cliente recibido:", this.quesera);
            this.dataCliente(this.quesera.int_cliente_id, this.quesera.str_cliente_nombre);
        }
    }
    idCliente!: number;
    nombre!: string

    dataCliente(id: number, nombre : string) {
        this.idCliente = id;
        this.nombre = nombre
    }

    ngOnInit() {
        this.populateYears();
        this.selectedYear = this.currentYear;
    }
    selectMonth(month: string): void {
        this.selectedMonth = month;
        let fechaInicio = new Date(
            this.selectedYear,
            this.months.indexOf(this.selectedMonth),
            1
        );
        let fechaFin = new Date(
            this.selectedYear,
            this.months.indexOf(this.selectedMonth) + 1,
            0
        );
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        this.srvReportes
            .getReporteBalanceComprobacion(
                this.idCliente,
                this.fechaInicio,
                this.fechaFin
            )
            .subscribe((data: any) => {
                if (data.status) {
                    const pdfSrc: SafeResourceUrl =
                        this.sanitizer.bypassSecurityTrustResourceUrl(
                            `data:application/pdf;base64,${data.body}`
                        );
                    this.dialog.open(VerPdfComponent, {
                        width: "80%",
                        data: { pdfSrc },
                    });
                } else {
                    Swal.fire({
                        title: "Reporte de Balance de Comprobación",
                        text: "No se pudo generar el reporte",
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
    }
    populateYears(): void {
        for (let i = this.currentYear; i >= this.currentYear - 10; i--) {
            this.years.push(i);
        }
    }
    generarPDF() {
        //valido que las fechas no sean nulas
        if (this.fechaInicio == null || this.fechaFin == null) {
            return;
        }
        this.srvReportes
            .getReporteBalanceComprobacion(
                this.idCliente,
                this.fechaInicio,
                this.fechaFin
            )
            .subscribe((data: any) => {
                if (data.status) {
                    const pdfSrc: SafeResourceUrl =
                        this.sanitizer.bypassSecurityTrustResourceUrl(
                            `data:application/pdf;base64,${data.body}`
                        );
                    this.dialog.open(VerPdfComponent, {
                        width: "80%",
                        data: { pdfSrc },
                    });
                } else {
                    Swal.fire({
                        title: "Reporte de Balance de Comprobación",
                        text: "No se encontraron registros",
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
    }
}
