import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from "config/config";

@Injectable({
  providedIn: 'root'
})
export class PdfService {
    
      constructor( private http: HttpClient) { }

        //Rutas de la API

        private urlApi_pdf_ingresos_gastos : string = config.URL_API_BASE + 'reportes/ingresos-gastos';
        private urlApi_pdf_balance_general : string = config.URL_API_BASE + 'reportes/balance-general';
        private urlApi_pdf_balance_comprobacion : string = config.URL_API_BASE + 'reportes/comprobacion';
    //obtener pdf de ingresos y gastos by idCliente con httpParams
    getReporteIngresosGastos(idCliente: any, fechaInicio: any, fechaFin: any) {
        let params = new HttpParams()
        .set('fechaInicio', fechaInicio)
        .set('fechaFin', fechaFin);
        return this.http.get(this.urlApi_pdf_ingresos_gastos + '/' + idCliente , 
            {params});
    }

    //obtener pdf de balance general by idCliente con httpParams
    getReporteBalanceGeneral(idCliente: any, fechaInicio: any, fechaFin: any) {
        let params = new HttpParams()
        .set('fechaInicio', fechaInicio)
        .set('fechaFin', fechaFin);
        return this.http.get(this.urlApi_pdf_balance_general + '/' + idCliente , 
            {params});
    }

    //obtener pdf de balance de comprobacion by idCliente con httpParams
    getReporteBalanceComprobacion(idCliente: any, fechaInicio: any, fechaFin: any) {
        let params = new HttpParams()
        .set('fechaInicio', fechaInicio)
        .set('fechaFin', fechaFin);
        return this.http.get(this.urlApi_pdf_balance_comprobacion + '/' + idCliente , 
            {params});
    }
   
}
