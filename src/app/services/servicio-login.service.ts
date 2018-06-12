import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class ServicioLoginService{
  username:string;
  loggedIn:boolean;
  mensajeError:string;

  constructor( 
    private http: Http
  ){

    //inicializamos los valores
    this.username = "";
    this.loggedIn = false;
    this.mensajeError = "Error en llamada Http";
    
  }

  login(usuario,clave){ 

    let url = environment.API_ENDPOINT + 'login';
    let dataGet = { Usuario:usuario, Clave:clave };
    

    return this.http.post(url,dataGet, {headers: new Headers({'Content-Type': 'application/json'})})
      .map((data) =>
        data.json()
    ).map(data =>{
      //control de errores
      if(data.Mensaje.Codigo == "1"){
        this.loggedIn = false;
        this.mensajeError = "Usuario no existe";
      }
      else if (data.Mensaje.Codigo == "2"){
        this.loggedIn = false;
        this.mensajeError = "Contraseña inválida";
      }
      else if (data.Mensaje.Codigo == "0"){

        var fullUser = JSON.stringify(data.Datos);
        var nombreUser = data.Datos.NombreUsuario;
        var pass = data.Datos.Password;
        var rol = data.Datos.RolesUsuarios[0];
        var ecol = data.Datos.EncoId;
        var token = data.Datos.TokenSession;
        var repo = data.Datos.VeReportes;
        var primerNombre = data.Datos.NombreCompleto.split(" ")[0];
        var apellPaterno = data.Datos.ApellidoPaterno;
        var stringContratante = data.Datos.Contratante;
        if (rol == "Super Administrador" && ecol < 1){
          ecol = 1;
        }


        sessionStorage.setItem('Usuario',fullUser);
        sessionStorage.setItem('UserName', nombreUser);
        sessionStorage.setItem('Contraseña', pass);
        sessionStorage.setItem('Rol',rol );
        sessionStorage.setItem('Ecol',ecol);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('VerReporte',repo);
        sessionStorage.setItem('Nombre',primerNombre);
        sessionStorage.setItem('Apellido', apellPaterno);
        sessionStorage.setItem('Contratante',stringContratante);

        this.loggedIn = true;
        this.mensajeError = data.Mensaje.Texto;
        
      }
      else {
        this.loggedIn = false;

        if (data.Mensaje != null){
          if (data.Mensaje.Codigo == "1"){
            this.mensajeError = "Usuario no existe";
          }
          if (data.Mensaje.Codigo == "2"){
            this.mensajeError = "Clave incorrecta";
          }
          if (data.Mensaje.Codigo == "5"){
            this.mensajeError = "Usuario Inactivo o eliminado";
          }
          if(data.Mensaje.Codigo == "13"){
            this.mensajeError = "Token invalido"
          }
        }
        else
          this.mensajeError = "Error de comunicación con el servidor";          
      }
      return this.loggedIn;
    });
  }

  logout():void{
    sessionStorage.clear();
    this.username = "";
    this.loggedIn = false;
  }

  isLoggedId(){
    return this.loggedIn;
  }

  getUsersWeb(rol,ecolId,token,usuario){  

    let url = environment.API_ENDPOINT + 'login?rol=' + rol + '&ecolId=' + ecolId + '&token=' + token + '&usuario=' + usuario;
    let data = this.http.get(url).map(data => data.json());
    return data;
  }
  
  createModifyWebUser(
    esNuevo,
    nombreUsuario,
    email,
    password,
    rol,
    ecolId,
    apellidoPaterno,
    apellidoMaterno,
    direccion,
    idRegion,
    idComuna,
    nombres,
    rut,
    estamento,
    contratante,
    veReportes,
    restoDireccion,
    usuarioCreador,
    telefonoCelular,
    telefonoFijo
  ){
    let url = environment.API_ENDPOINT + 'Login';

   let dataGet = {
    EsNuevo: esNuevo,
    NombreUsuario: nombreUsuario,
    Email: email,
    Password: password,
    Rol: rol,
    EcolId: ecolId,
    ApellidoPaterno: apellidoPaterno,
    ApellidoMaterno:apellidoMaterno,
    Direccion: direccion,
    IdRegion: idRegion,
    IdComuna: idComuna,
    Nombres: nombres,
    Rut: rut,
    Estamento: estamento,
    Contratante: contratante,
    VeReportes: veReportes,
    RestoDireccion:restoDireccion,
   UsuarioCreador: nombreUsuario,
    TelefonoCelular: telefonoCelular,
    TelefonoFijo: telefonoFijo
  };

    let data = this.http.put(url, dataGet, {
      headers: new Headers({'Content-Type': 'application/json'})
    });
    return data;
  }


}

