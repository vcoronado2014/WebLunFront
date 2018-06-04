import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class GlobalService {

  constructor(
    private http: Http
  ) { 

  }
  postRegiones(ecolId){
    let url = environment.API_ENDPOINT + 'Region';
    let dataGet = {
       EcolId: ecolId 
      };

      let data = this.http.post(url, dataGet, {
        headers: new Headers({'Content-Type': 'application/json'})
      });
      return data;


   }
   postComunas(regId){
    let url = environment.API_ENDPOINT + 'Comuna';
    let dataGet = {
       RegId: regId 
      };

      let data = this.http.post(url, dataGet, {
        headers: new Headers({'Content-Type': 'application/json'})
      });
      return data;

   }
   postEntidadesContratantes(ecolId){
    let url = environment.API_ENDPOINT + 'EntidadContratante';
    let dataGet = {
       EcolId: ecolId 
      };

      let data = this.http.post(url, dataGet, {
        headers: new Headers({'Content-Type': 'application/json'})
      });
      return data;

   }

}
