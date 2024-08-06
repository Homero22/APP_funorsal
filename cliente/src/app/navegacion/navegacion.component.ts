import { Component } from '@angular/core';
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
export class NavegacionComponent {

  paginaActual: string = 'Inicio';

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

  currentComponent: string = 'Inicio';

  showComponent(component: string) {
    this.currentComponent = component;
    this.paginaActual = component;
  }

}
