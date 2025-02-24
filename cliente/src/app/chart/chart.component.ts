import {
    Component,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnInit,
    OnDestroy,
    Input,
} from "@angular/core";
import Chart, { ChartDataset, ChartType } from "chart.js/auto";
import { Subject, takeUntil } from "rxjs";
import Swal from "sweetalert2";
import { ClienteData } from "../core/models/cliente";
import { libroDiarioService } from "../core/services/libroDiario.service";

@Component({
    selector: "app-chart",
    templateUrl: "./chart.component.html",
    styleUrls: ["./chart.component.css"],
})
export class ChartComponent implements OnInit, OnDestroy {
    @Input() quesera!: ClienteData
    maxAnio = new Date().getFullYear();
    aniosDisponibles: number[] = [];
    datosPorAnioIngresos: { [anio: number]: number[] } = {};
    datosPorAnioGastos: { [anio: number]: number[] } = {};


    listaTipoGraficos: ChartType[] = ["line", "bar",];

    anioSeleccionado: number = new Date().getFullYear();
    tipoGraficoSeleccionado: ChartType = "line";

    anioSeleccionadoChange(anio: number) {
        this.anioSeleccionado = anio;
       
    }

    generarAniosDisponibles() {
        const anioActual = new Date().getFullYear();
        for (let anio = 2000; anio <= anioActual; anio++) {
            this.aniosDisponibles.push(anio);
        }
    }
    actualizarGrafico() {
        this.obtenerDatosPorAnio(this.anioSeleccionado);

        this.inicializarGrafico(this.anioSeleccionado);
    }
 
    obtenerDatosPorAnio(anio: number) {
       this.srvLibroDiario.getIngresosGastos(this.quesera.int_cliente_id, anio).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        if(!data.status){
            Swal.fire({
                title: 'No se econtraron datos',
                text: 'No se encontraron datos para el año seleccionado',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
            return;
        }
        Swal.fire({
            title: 'Datos cargados',
            text: 'Datos cargados correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
            this.datosPorAnioIngresos[anio] = data.ingresos;
            this.datosPorAnioGastos[anio] = data.gastos;
            this.inicializarGrafico(anio);
        });
    }



  
    constructor(
        private srvLibroDiario: libroDiarioService
    ) {
    
        
    }

    inicializarGrafico(anio: number) {
        this.chart.destroy();
        this.chart = new Chart("myChart", {
            type: this.tipoGraficoSeleccionado,
            data: {
                labels: [
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
                ],
                datasets: [
                    {
                        label: "Ingresos",
                        data: this.datosPorAnioIngresos[anio],
                        backgroundColor: 'rgba(75, 192, 192, 0.77)', // Azul claro
                        borderColor: "rgb(54, 162, 235)", // Azul
                        borderWidth: 1,
                    },
                    {
                        label: "Gastos",
                        data: this.datosPorAnioGastos[anio],
                        backgroundColor: 'rgba(255, 99, 133, 0.73)', // Rojo claro
                        borderColor: "rgb(255, 99, 132)", // Rojo
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
    cambiarTipoGrafico(tipoGrafico: ChartType) {
        this.tipoGraficoSeleccionado = tipoGrafico;
            
        // this.chart.data.datasets = [
        //     {
        //         label: "Ingresos",
        //         data: this.datosPorAnioIngresos[anio],
        //         backgroundColor: 'rgba(75, 192, 192, 0.77)', // Azul claro
        //         borderColor: "rgb(54, 162, 235)", // Azul
        //         borderWidth: 1,
        //     },
        //     {
        //         label: "Gastos",
        //         data: this.datosPorAnioGastos[anio],
        //         backgroundColor: 'rgba(255, 99, 133, 0.73)', // Rojo claro
        //         borderColor: "rgb(255, 99, 132)", // Rojo
        //         borderWidth: 1,
        //     },
        // ];
        // this.chart.update();
    }


    ngOnInit(): void {
        this.generarAniosDisponibles();
        this.obtenerDatosPorAnio(this.anioSeleccionado);
        const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.chart = new Chart("myChart", {
            type: this.tipoGraficoSeleccionado,
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Ingresos",
                        data: this.datosPorAnioIngresos[this.anioSeleccionado],
                        backgroundColor: 'rgba(4, 5, 5, 0.77)', // Azul claro
                        borderColor: "rgb(54, 162, 235)", // Azul
                        borderWidth: 1,
                    },
                    {
                        label: "Gastos",
                        data: this.datosPorAnioGastos[this.anioSeleccionado],
                        backgroundColor: 'rgba(255, 99, 133, 0.73)', // Rojo claro
                        borderColor: "rgb(255, 99, 132)", // Rojo
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
        
    }
    ngOnDestroy(): void {
        this.destroy$.next({});
        this.destroy$.complete();    
    }
    private destroy$ = new Subject<any>();

    chart!: Chart;

    //funcion para detectar cambio de quesera
    ngOnChanges(){
        this.getDataQuesera()
    }

    //funcion para obtener la data de la quesera
    getDataQuesera(){
        console.log('Cambio quesera ',this.quesera)
        this.obtenerDatosPorAnio(this.anioSeleccionado);
    }





  

   


}
