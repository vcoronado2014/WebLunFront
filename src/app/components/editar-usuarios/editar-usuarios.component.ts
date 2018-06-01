import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { HttpErrorResponse } from '@angular/common/http';

//Servicios
import { ServicioLoginService } from '../../services/servicio-login.service';

declare var $:any;
 var rol = sessionStorage.getItem("Rol");
 var ecolId = sessionStorage.getItem("Ecol");
 var token = sessionStorage.getItem("token");
 var usuario = sessionStorage.getItem("UserName");
 

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

 users:any;
 loading = false;

  constructor( private auth: ServicioLoginService ) { 


  }

  ngOnInit() {
    this.loading = true;   
    this.LoadTable();
    setTimeout(function(){       
      $(function(){
        var table = $('#tablaUserWeb').DataTable( {
          columns: [
              { title: "Run" },
              { title: "Nombre Usuario" },
              { title: "Nombre Completo" },
              { title: "Región" },
              { title: "Estamento" },
              { title: "Rol" }
          ],
          languaje: {
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
          },
          colReorder: true,
          dom: 'Bfrtip'
        });
      });
    }, 9000);
    this.loading = false;  
 }

  LoadTable(){
    this.auth.getUsersWeb(rol,String(ecolId),token,usuario).subscribe(
      data => {
        this.users = data.Datos;
        console.log(this.users);
      }
    );
  };


}
