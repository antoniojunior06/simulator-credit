import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Entrada } from '../dados/entrada';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SimuladorService {

  private readonly api =  'https://apphackaixades.azurewebsites.net/api/Simulacao'

  constructor(private http: HttpClient) { }

  cadastra(entrada: Entrada): Observable<any> {
    return this.http.post<any>(this.api, entrada)
  }

}
