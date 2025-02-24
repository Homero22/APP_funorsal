import { Component, OnInit } from "@angular/core";
import { multi } from "./data";
import Chart from "chart.js/auto";
import { ClienteService } from "../core/services/cliente.service";
import { LoginService } from "../core/services/login.service";
import { Cliente, ClienteData } from "../core/models/cliente";
import { MatSelect } from "@angular/material/select";

@Component({
    selector: "app-inicio",
    templateUrl: "./inicio.component.html",
    styleUrls: ["./inicio.component.css"],
})
export class InicioComponent implements OnInit {
    public chart: any;
    public chart2: any;

    informacionQuesera!: any;
    isSuperAdmin: boolean = false;
    listadoClientes: ClienteData[] = [];
    clienteSeleccionado: Cliente | null = null;
    selectedQuesera!: ClienteData;
    quesera: string = "";

    constructor(
        private srvCliente: ClienteService,
        private srvLogin: LoginService
    ) {}
    onClienteChange(event: any) {
        this.quesera = event.value.str_cliente_nombre;
        this.selectedQuesera = event.value;
    }

    ngOnInit() {

        this.isSuperAdmin = this.srvLogin.isSuperAdmin();
        if (this.isSuperAdmin) {
            this.datosAdmin();
        } else {
            this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
                this.informacionQuesera = cliente;
                this.quesera = this.informacionQuesera.str_cliente_nombre;
                this.selectedQuesera = this.informacionQuesera;
            });
        }
    }

    datosAdmin() {
        this.srvCliente.obtenerClientes();
        this.srvCliente.selectAllClientes$.subscribe((clientes: any) => {
            this.listadoClientes = clientes;
            this.selectedQuesera = this.listadoClientes[0];
            if (this.selectedQuesera) {
                this.quesera = this.selectedQuesera.str_cliente_nombre;
            }
          
        });
        
    }
}
