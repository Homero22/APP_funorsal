import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ModalComponent } from "../modal/modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ClienteService } from "../core/services/cliente.service";
import { Subject, takeUntil } from "rxjs";
import Swal from "sweetalert2";
import { LoginService } from "../core/services/login.service";

@Component({
    selector: "app-perfil",
    templateUrl: "./perfil.component.html",
    styleUrls: ["./perfil.component.css"],
})
export class PerfilComponent implements OnInit {
    informacionQuesera!: any;
    idUsuario!: number;
    perfilForm!: FormGroup;
    usuarioForm!: FormGroup;
    private destroy$ = new Subject<any>();
    isSuperAdmin: boolean = false;
    usuario: any;

    ngOnInit() {

        this.isSuperAdmin = this.srvLogin.isSuperAdmin();
    
        if (this.isSuperAdmin) {
            console.log('super admin');
            this.srvLogin.gUsuario$.pipe(takeUntil(this.destroy$)).subscribe((usuario: any) => {
                this.usuario = usuario;
                this.llenarUsuarioForm(this.usuario);
            }
            );
            
        }else{
            console.log('no super admin');
            this.srvCliente.selectClienteLogueado$.subscribe((cliente: any) => {
                this.informacionQuesera = cliente;
                
            });
            this.llenarFormulario();
        }
    }

    llenarUsuarioForm(usuario: any) {
        console.log('llena user');
        this.usuarioForm = this.fb.group({
            str_usuario_nombre: [
                {
                    value: this.usuario.str_usuario_nombre,
                    disabled: true,
                },
            ],
            str_usuario_email: [
                {
                    value: this.usuario.str_usuario_email,
                    disabled: true,
                },
            ],
            str_usuario_password: [
                {
                    value: this.usuario.str_usuario_password,
                    disabled: true,
                },
            ],
        });
    }

    llenarFormulario() {
        console.log('llena form 1',);
        this.perfilForm = this.fb2.group({
            str_cliente_nombre: [
                {
                    value: this.informacionQuesera.str_cliente_nombre,
                    disabled: true,
                },
            ],
            str_cliente_correo: [
                {
                    value: this.informacionQuesera.str_cliente_correo,
                    disabled: true,
                },
            ],
            str_cliente_password: [
                {
                    value: this.informacionQuesera.str_cliente_password,
                    disabled: true,
                },
            ],
            str_cliente_telefono: [
                {
                    value: this.informacionQuesera.str_cliente_telefono,
                    disabled: true,
                },
            ],
            str_cliente_direccion: [
                {
                    value: this.informacionQuesera.str_cliente_direccion,
                    disabled: true,
                },
            ],
            str_cliente_ruc: [
                {
                    value: this.informacionQuesera.str_cliente_ruc,
                    disabled: true,
                },
            ],
            str_cliente_usuario: [
                {
                    value: this.informacionQuesera.str_cliente_usuario,
                    disabled: true,
                },
            ],
        });
    }

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private fb2: FormBuilder,
        public srvCliente: ClienteService,
        private srvLogin: LoginService,
    ) {
        this.usuarioForm = this.fb2.group({
            str_usuario_nombre: [""],
            str_usuario_email: [""],
            str_usuario_password: [""],
        });
        this.perfilForm = this.fb.group({
            str_cliente_nombre: [],
            str_cliente_correo: [],
            str_cliente_password: [],
            str_cliente_telefono: [],
            str_cliente_direccion: [],
            str_cliente_ruc: [],
            str_cliente_usuario: [],
        });
    }

    openModal(size: string): void {
        this.dialog.open(ModalComponent, {
            data: { size: size, contentType: "editarPerfil" },
        });
    }

    onEdit() {
        this.srvCliente.setClienteSeleccionado(this.informacionQuesera);
        this.openModal("large");
    }

    onEditUser() {}
}
