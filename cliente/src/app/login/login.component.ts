import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../core/services/login.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../core/services/cliente.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Formulario de inicio de sesión
  public usuario: string = "";
  public contrasena: string = "";
  loginForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    public srvCliente: ClienteService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['',[Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  ngOnInit() {

  }

  iniciarSesion(){
      if (this.loginForm.valid) {
        // Conectarse al servidor
        Swal.fire({
          title: 'Iniciando sesión',
          text: 'Espere por favor...',
          allowOutsideClick: false,
          showConfirmButton: false
        });
        this.loginService.login(this.loginForm.get('usuario')?.value, this.loginForm.get('contrasena')?.value).subscribe(
          (data: any) => {
            if(data.status){
              Swal.close();
              Swal.fire({
                title: 'Inicio de sesión correcto',
                text: 'Bienvenido',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
              if(data.body.str_usuario_nombre){
                //es administrador
                this.loginService.isAdmin(true);

                              //guardar el id del usuario
              this.srvCliente.setidClienteLogueado(data.body.int_usuario_id);
              //this.srvCliente.setClienteLogueado(data.body)

              //guardar el id del usuario en localStorage
              localStorage.setItem('idUsuario', data.body.int_usuario_id.toString());

              }else{
              //guardar el id del usuario
              this.srvCliente.setidClienteLogueado(data.body.int_cliente_id);
              this.srvCliente.setClienteLogueado(data.body)

              //guardar el id del usuario en localStorage
              this.loginService.guardarIdClienteLogueado(data.body.int_cliente_id);
              }
              this.router.navigate(['/inicio']);
              this.loginService.logueado = true;
            }else{
              Swal.close();
              Swal.fire({
                title: 'Error',
                text: 'Usuario o contraseña incorrectos',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['/login']);
            }

          },
          (error) => {
            console.log(error);
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'Usuario o contraseña incorrectos',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        );

      } else {
        console.log("Formulario inválido");
      }


  }

}
