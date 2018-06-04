import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { HttpErrorResponse } from '@angular/common/http';

//Servicios
import { ServicioLoginService } from '../../services/servicio-login.service';

declare var jQuery:any;

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

  constructor( private auth: ServicioLoginService ) { }

  ngOnInit() {
    jQuery(document).ready(function() {
      jQuery('#tablaUserWeb').DataTable();
    });

  }
  createModifyUser(
    esNuevo,
    nombreUsuario,
    email,
    password,
    rol,
    ecolId,
    apellidoPaterno,
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
    this.auth.createModifyWebUser(
      esNuevo,
      nombreUsuario,
      email,
      password,
      rol,
      ecolId,
      apellidoPaterno,
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
    ).subscribe(
      data => {
        
        if (data){
          var usuarioCambiado = data.json();
        }
      },
      err => {
        console.error(err);
        },
      () => console.log('creado con exito')
    );
  }

}
