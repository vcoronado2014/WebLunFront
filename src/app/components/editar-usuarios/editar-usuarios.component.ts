import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//Servicios
import { ServicioLoginService } from '../../services/servicio-login.service';
import { GlobalService } from '../../services/global.service';

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
 listaRoles;
 listaContratantes;
 listaRegiones;
 listaComunas;
 listaEstamentos;
 tipoDeAccion:string;
  //formulario
 forma:FormGroup;

  constructor( private auth: ServicioLoginService,
               private fb: FormBuilder,
               private global: GlobalService,
               private toastr: ToastsManager ){

    this.listaRoles = ['Administrador Web'];
    this.listaContratantes = ['Rayen','Saydex'];
    this.listaRegiones = ['Valparaíso','Tarapacá'];
    this.listaComunas = ['Ñuñoa','San Joaquín'];
    this.listaEstamentos = ['Profesional','Técnico'];

    this.forma = new FormGroup({
      'nuevoUsuario': new FormControl('', [Validators.required,
                                          Validators.minLength(3)]),
      'nuevoUsuarioRun': new FormControl(),
      'nuevoUsuarioNombre': new FormControl('', [Validators.required,
                                                  Validators.minLength(3)]),
      'nuevoUsuarioApellidoPat': new FormControl('', [Validators.required,
                                                      Validators.minLength(3)]),
      'nuevoUsuarioApellidoMat': new FormControl(),
      'nuevoUsuarioRegion': new FormControl('', Validators.required),
      'nuevoUsuarioComumna': new FormControl('', Validators.required),
      'nuevoUsuarioDireccion': new FormControl('', [Validators.required,
                                                    Validators.minLength(3)]),
      'nuevoUsuarioRestoDireccion': new FormControl(),
      'nuevoUsuarioCorreo': new FormControl('', [Validators.required,
                                                  Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      'nuevoUsuarioEstamento': new FormControl('', Validators.required),
      'nuevoUsuarioTelefonoFijo': new FormControl(),
      'nuevoUsuarioTelefonoCelular': new FormControl('', [Validators.minLength(9),
                                                    Validators.maxLength(9)]),
      'nuevoUsuarioEntidad': new FormControl('', Validators.required),
      'nuevoUsuarioRol': new FormControl('', Validators.required),
      'nuevoUsuarioContrasena1': new FormControl(),
      'nuevoUsuarioContrasena2': new FormControl()
    })
    console.log(this.forma);
  }

  ngOnInit() {
   this.LoadTable();
    setTimeout(function(){ 
      this.loading = true;      
      $(function(){   
        $('#tablaUserWeb tfoot th').each( function () {
          var title = $(this).text();
          $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
        });     
        var table = $('#tablaUserWeb').DataTable({
          columns: [
              { title: "Run" },
              { title: "Nombre Usuario" },
              { title: "Nombre Completo" },
              { title: "Región" },
              { title: "Estamento" },
              { title: "Rol" }
          ],
          "searching": false,
          "info": false,
          "dom": 'lrtip',
          "languaje": {
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
        });
      });
      this.loading = false;
    }, 8000);
 }

  LoadTable(){
    this.loading = true; 
    this.auth.getUsersWeb(rol,String(ecolId),token,usuario).subscribe(
      data => {
        this.users = data.Datos;
        console.log(this.users);
        this.loading = false;
      }
    );
  }

  modalCrearUsuario(){
    this.tipoDeAccion = 'Crear';
    this.forma.reset({});
  }

  guardarUsuario(usuario){
    console.log(this.forma.valid);
    console.log(this.forma);
    
    if(this.forma.valid){
      alert('Guardé');
    }
    
  }

  obtenerRegiones(ecolId){
    //indicador valor
    this.global.postRegiones(ecolId.toString()).subscribe(
        data => {
          if (data){
            var listaRegionesR = data.json();

            //este arreglo habria que recorrerlo con un ngfor
            if (listaRegionesR.Datos){
              this.listaRegiones = listaRegionesR.Datos;


              console.log(this.listaRegiones);
            }
            else{
              //levantar un modal que hubo un error
              this.showToast('error', 'Error al recuperar Roles', 'Roles');
            }

          }
        },
        err => console.error(err),
        () => console.log('get info Regiones')
      );

  }

  obtenerComunas(regId){
    //indicador valor
    this.global.postComunas(regId.toString()).subscribe(
        data => {
          if (data){
            var listaComunasR = data.json();

            //este arreglo habria que recorrerlo con un ngfor
            if (listaComunasR.Datos){
              this.listaComunas = listaComunasR.Datos;


              console.log(this.listaComunas);
            }
            else{
              //levantar un modal que hubo un error
              this.showToast('error', 'Error al recuperar Roles', 'Roles');
            }

          }
        },
        err => console.error(err),
        () => console.log('get info Comunas')
      );

  }

  obtenerEntidadesContratantes(ecolId){
    //indicador valor
    this.global.postEntidadesContratantes(ecolId.toString()).subscribe(
        data => {
          if (data){
            var listaEntidadesContratantesR = data.json();

            //este arreglo habria que recorrerlo con un ngfor
            if (listaEntidadesContratantesR.Datos){
              this.listaContratantes = listaEntidadesContratantesR.Datos;


              console.log(this.listaContratantes);
            }
            else{
              //levantar un modal que hubo un error
              this.showToast('error', 'Error al recuperar Roles', 'Roles');
            }

          }
        },
        err => console.error(err),
        () => console.log('get info Contratantes')
      );

  }

  showToast(tipo, mensaje, titulo){
    if (tipo == 'success'){
      this.toastr.success(mensaje, titulo);
    }
    if (tipo == 'error'){
      this.toastr.error(mensaje, titulo);
    }
    if (tipo == 'info'){
      this.toastr.info(mensaje, titulo);
    }
    if (tipo == 'warning'){
      this.toastr.warning(mensaje, titulo);
    }

  }

}