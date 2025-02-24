import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ClienteService } from '../core/services/cliente.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {

  paginaActual: string = 'Inicio';
  isAdmin: boolean = localStorage.getItem('isAdmin') === 'true';



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private srvLogin: LoginService) {

    this.srvLogin.selectClienteLogueado$.subscribe((cliente: any) => {
      this.paginaActual = 'Inicio';
    });
  }
  isSuperAdmin: boolean = false;    
    ngOnInit(): void {
        this.isSuperAdmin = this.srvLogin.isSuperAdmin();
    }

  currentComponent: string = 'Inicio';

  showComponent(component: string) {
    this.currentComponent = component;
    this.paginaActual = component;
    if(component==='Cliente'){
      this.paginaActual = 'Queseras';
    }

  }
  salir(){
    this.srvLogin.logout();
  }

}
