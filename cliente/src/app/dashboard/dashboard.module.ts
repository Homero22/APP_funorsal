import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";

const routes: Routes = [
  {
    path:'',
    children: [

    ]

  },
  {
    path:'**', redirectTo:''
  }
];

@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
