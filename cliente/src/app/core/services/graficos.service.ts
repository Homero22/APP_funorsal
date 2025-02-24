import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import config from "config/config";
import { Subject, takeUntil } from "rxjs";





@Injectable({
  providedIn: 'root'
})

export class GraficosService{

  constructor(private http:HttpClient) {}

  private urlApi_graficos: string = config.URL_API_BASE + 'graficos/incidencias-por-mes';

  private destroy$ = new Subject<any>();

  private dataMetadata$ = new Subject<DataMetadata>();

  metaData!: DataMetadata;

  setDataMetadata(data:DataMetadata){
    this.dataMetadata$.next(data);
  }

  get selectMetadata$(){
    return this.dataMetadata$.asObservable();
  }

  getGraficos(anio:any){
    return this.http.get<any>(this.urlApi_graficos + '/' + anio,
      {
        withCredentials: true
      }
    );
  }



}


