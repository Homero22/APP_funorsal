import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ClienteService } from "src/app/core/services/cliente.service";
import { CuentasService } from "src/app/core/services/cuentas.service";
import { libroDiarioService } from "src/app/core/services/libroDiario.service";
import Swal from "sweetalert2";
import { MatFormField } from "@angular/material/form-field";
interface DetalleLibroDiario {
    int_detalle_libro_diario_id: number;
    int_libro_diario_id: number;
    str_detalle_libro_diario_nombre_cuenta: string;
    str_detalle_libro_diario_codigo_cuenta: string;
    str_detalle_libro_diario_tipo: string;
    dc_detalle_libro_diario_monto: string;
    dt_fecha_creacion: string;
    dt_fecha_actualizacion: string;
}

interface LibroDiario {
    int_libro_diario_id: number;
    dt_libro_diario_fecha: string;
    int_cliente_id: number;
    str_libro_diario_descripcion: string | null;
    detalle_libro_diarios: DetalleLibroDiario[];
}

@Component({
    selector: "app-ver-diarios",
    templateUrl: "./ver-diarios.component.html",
    styleUrls: ["./ver-diarios.component.css"],
})
export class VerDiariosComponent implements OnInit {
    informacionQuesera!: any;
    journalEntries: LibroDiario[] = [];
    displayedColumns: string[] = [
        "int_libro_diario_id",
        "dt_libro_diario_fecha",
        "detalle_libro_diarios",
        "acciones",
    ];

    meses = [
        { value: 1, viewValue: "Enero" },
        { value: 2, viewValue: "Febrero" },
        { value: 3, viewValue: "Marzo" },
        { value: 4, viewValue: "Abril" },
        { value: 5, viewValue: "Mayo" },
        { value: 6, viewValue: "Junio" },
        { value: 7, viewValue: "Julio" },
        { value: 8, viewValue: "Agosto" },
        { value: 9, viewValue: "Septiembre" },
        { value: 10, viewValue: "Octubre" },
        { value: 11, viewValue: "Noviembre" },
        { value: 12, viewValue: "Diciembre" },
    ];
    mes = new Date().getMonth() + 1;
    anio = new Date().getFullYear();
    totalEntries: number = 0;

    constructor(
        private srvCliente: ClienteService,
        private srvCuentas: CuentasService,
        private srvLibroDiario: libroDiarioService,
        private cdr: ChangeDetectorRef
    ) {
        this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
            this.informacionQuesera = cliente;
            //this.srvCuentas.obtenerCuentasDelCliente(this.informacionQuesera.int_cliente_id);
            this.obtenerLibrosDiarios(10, 0, this.mes, this.anio);
        });
    }

    ngOnInit() {}

    dataLibroDiario: any;

    obtenerLibrosDiarios(limit = 10, offset = 0, mes?: number, anio?: number) {
        this.srvLibroDiario
            .getLibrosDiarios(
                this.informacionQuesera.int_cliente_id,
                limit,
                offset,
                mes,
                anio
            )
            .subscribe((librosDiarios: any) => {
                if (librosDiarios.status) {
                    Swal.fire({
                        title: "Libros Diarios",
                        icon: "success",
                        text: librosDiarios.message,
                    });
                    console.log(librosDiarios.body);
                    this.journalEntries = librosDiarios.body;
                    this.totalEntries = librosDiarios.total;
                } else {
                    Swal.fire({
                        title: "Libros Diarios",
                        icon: "error",
                        text: librosDiarios.message,
                    });
                    this.journalEntries = [];
                }
            });
    }

    aplicarFiltro() {
        this.obtenerLibrosDiarios(10, 0, this.mes, this.anio);
    }

    cambiarPagina(event: PageEvent) {
        console.log(event);
        this.obtenerLibrosDiarios(
            event.pageSize,
            event.pageIndex * event.pageSize,
            this.mes,
            this.anio
        );
    }

    // Datos para editar
    libroDiarioSeleccionado: any = null;

    toggleEditar(element: any) {
        this.libroDiarioSeleccionado = {
            ...element,
            detalle_libro_diarios: element.detalle_libro_diarios.map(
                (detalle: any) => ({
                    ...detalle,
                    nuevoSaldoDebe: 0,// Nuevo saldo en DEBE
                    nuevoSaldoHaber: 0, // Nuevo saldo en HABER
                })
            ),
        };
        console.log(this.libroDiarioSeleccionado);
        this.calcularTotales();
    }
    totalDebe: number = 0;
    totalHaber: number = 0;
    mostrarDebe: number = 0;
    mostrarHaber: number = 0;

    calcularTotales() {

        
      
        this.totalDebe = 0;
        this.totalHaber = 0;
        this.mostrarDebe = 0;
        this.mostrarHaber = 0;

        if (
            !this.libroDiarioSeleccionado ||
            !this.libroDiarioSeleccionado.detalle_libro_diarios
        ) {
            
            return;
        }

        this.libroDiarioSeleccionado.detalle_libro_diarios.forEach((detalle: any) => {
            
            const montoDebe = Number(detalle.dc_detalle_libro_diario_monto) || 0;
            const nuevoDebe = Number(detalle.nuevoSaldoDebe) || 0;
            const montoHaber = Number(detalle.dc_detalle_libro_diario_monto) || 0;
            const nuevoHaber = Number(detalle.nuevoSaldoHaber) || 0;
    
            if (detalle.str_detalle_libro_diario_tipo === 'DEBE') {
                this.totalDebe += montoDebe 

            } else if (detalle.str_detalle_libro_diario_tipo === 'HABER') {
                this.totalHaber += montoHaber 
            }
            this.totalDebe += nuevoDebe;
            this.totalHaber += nuevoHaber;
        });

        this.cdr.detectChanges();
    }

    guardarEdicion() {
        let totalDebe = 0;
        let totalHaber = 0;

        // Recorrer los detalles para calcular las sumas de DEBE y HABER
        this.libroDiarioSeleccionado.detalle_libro_diarios.forEach(
            (detalle: any) => {
                let montoDebe =
                    detalle.str_detalle_libro_diario_tipo === "DEBE"
                        ? Number(detalle.dc_detalle_libro_diario_monto)
                        : 0;

                let montoHaber =
                    detalle.str_detalle_libro_diario_tipo === "HABER"
                        ? Number(detalle.dc_detalle_libro_diario_monto)
                        : 0;

                // Si hay nuevos valores en DEBE o HABER, sumarlos también
                if (detalle.nuevoSaldoDebe) {
                    montoDebe += Number(detalle.nuevoSaldoDebe);
                }
                if (detalle.nuevoSaldoHaber) {
                    montoHaber += Number(detalle.nuevoSaldoHaber);
                }

                totalDebe += montoDebe;
                totalHaber += montoHaber;
            }
        );

        // Validar que los totales sean iguales
        if (totalDebe !== totalHaber) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Las sumas de DEBE y HABER no coinciden",
            });
            return;
        }

        // Preparar datos para enviar al backend
        const datosActualizados = {
            ...this.libroDiarioSeleccionado,
            detalle_libro_diarios:
                this.libroDiarioSeleccionado.detalle_libro_diarios.map(
                    (detalle: any) => ({
                        ...detalle,
                        // Si hay nuevos saldos, reemplazar el valor de monto
                        dc_detalle_libro_diario_monto: detalle.nuevoSaldoDebe
                            ? Number(detalle.nuevoSaldoDebe)
                            : detalle.nuevoSaldoHaber
                            ? Number(detalle.nuevoSaldoHaber)
                            : detalle.dc_detalle_libro_diario_monto,
                    })
                ),
        };

        // Enviar datos a la API
        this.srvLibroDiario
            .editarLibroDiario(
                datosActualizados,
                this.libroDiarioSeleccionado.int_libro_diario_id
            )
            .subscribe((data: any) => {
                if (data.status) {
                    Swal.fire({
                        title: "Libro Diario",
                        icon: "success",
                        text: data.message,
                    });
                    this.obtenerLibrosDiarios(10, 0, this.mes, this.anio);
                } else {
                    Swal.fire({
                        title: "Libro Diario",
                        icon: "error",
                        text: data.message,
                    });
                }
            });

        // Cerrar formulario de edición
        this.libroDiarioSeleccionado = null;
    }

    cancelarEdicion() {
        this.libroDiarioSeleccionado = null;
    }
}
