import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModule } from './login/login.module';
import { FailedModule } from './failed/failed.module';
import { LoginComponent } from './login/login.component';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { LibroDiarioComponent } from './libroDiario/libroDiario.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'inicio', component: NavegacionComponent},
  {path:'libro-diario', component: LibroDiarioComponent},

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
