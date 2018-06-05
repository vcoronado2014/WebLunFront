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
  //usuario editado
  usuarioEditado;

  constructor( private auth: ServicioLoginService,
               private fb: FormBuilder,
               private global: GlobalService,
               private _vcr: ViewContainerRef,
               private toastr: ToastsManager ){

    this.toastr.setRootViewContainerRef(_vcr);
    if (rol != 'Super Administrador'){
      this.listaRoles = ['Administrador Web', 'Administrador Lun', 'Consultador'];
    }
    else{
      this.listaRoles = ['Administrador Web', 'Administrador Lun', 'Consultador', 'Super Administrador'];
    }
    this.listaContratantes = [];
    this.listaRegiones = [];
    this.listaComunas = [];
    this.listaEstamentos = ['Profesional','Técnico'];

    this.forma = new FormGroup({
      'nuevoUsuario': new FormControl('', [Validators.required,Validators.minLength(3)]),
      'nuevoUsuarioRun': new FormControl(),
      'nuevoUsuarioNombre': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'nuevoUsuarioApellidoPat': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'nuevoUsuarioApellidoMat': new FormControl(),
      'nuevoUsuarioRegion': new FormControl('', Validators.required),
      'nuevoUsuarioComuna': new FormControl('', Validators.required),
      'nuevoUsuarioDireccion': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'nuevoUsuarioRestoDireccion': new FormControl(),
      'nuevoUsuarioCorreo': new FormControl('', [Validators.required,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      'nuevoUsuarioEstamento': new FormControl('', Validators.required),
      'nuevoUsuarioTelefonoFijo': new FormControl(),
      'nuevoUsuarioTelefonoCelular': new FormControl('', [Validators.minLength(9),Validators.maxLength(9)]),
      'nuevoUsuarioEntidad': new FormControl('', Validators.required),
      'nuevoUsuarioRol': new FormControl('', Validators.required),
      'nuevoUsuarioContrasena1': new FormControl(),
      'nuevoUsuarioContrasena2': new FormControl(),
      'nuevoVerReporte':new FormControl('',[Validators.required])
    })
    console.log(this.forma);
  }

  ngOnInit() {
   this.LoadTable();
   //cargamos los demas elementos
   this.obtenerRegiones(String(ecolId));
   this.obtenerEntidadesContratantes(String(ecolId));
 }

  LoadTable(){
    this.loading = true; 
    this.auth.getUsersWeb(rol,String(ecolId),token,usuario).subscribe(
      data => {
        this.users = data.Datos; 
        $(function(){
          var table = $('#tablaUserWeb').DataTable({
            columns: [
                { title: "Run" },
                { title: "Nombre Usuario" },
                { title: "Nombre Completo" },
                { title: "Región" },
                { title: "Estamento" },
                { title: "Rol" },
                { title: "Opciones"}
            ],
            "language": {
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
            "lengthMenu": [ 10, 15, 20, 50, 100],
            "info": false,
            select: true,
            responsive: true,
            colReorder: true,
          });
        });       
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
      //se construye los elementos a guardar
      var nombreUsuario = this.forma.value.nuevoUsuario;
      var ecolId = this.forma.value.nuevoUsuarioEntidad.toString();
      var rolId = this.forma.value.nuevoUsuarioRol.toString();
      var nombres = this.forma.value.nuevoUsuarioNombre;
      var apellidoPaterno = this.forma.value.nuevoUsuarioApellidoPat;
      var apellidoMaterno = '';
      var usuarioCreador = sessionStorage.getItem('UserName');

      if (this.forma.value.nuevoUsuarioApellidoMat != null){
        apellidoMaterno = this.forma.value.nuevoUsuarioApellidoMat;
      }
      var email = this.forma.value.nuevoUsuarioCorreo;
      //es 0 puesto que es un usuario nuevo
      var esNuevo;
      var nombreUser;
      if(this.tipoDeAccion == 'Editar'){
        nombreUser = this.usuarioEditado;
        esNuevo = 'False'
      }
      var telefonoFijo = '';
      if (this.forma.value.nuevoUsuarioTelefonoFijo != null){
        telefonoFijo = this.forma.value.nuevoUsuarioTelefonoFijo;
      }
      var telefonoCelular = '';
      if(this.forma.value.nuevoUsuarioTelefonoCelular != null){
        telefonoCelular = this.forma.value.nuevoUsuarioTelefonoCelular;
      }
      var rut = '';
      if(this.forma.value.nuevoUsuarioRun != null){
        rut = this.forma.value.nuevoUsuarioRun;
      }
      var direccion = '';
      if(this.forma.value.nuevoUsuarioDireccion != null){
        direccion = this.forma.value.nuevoUsuarioDireccion;
      }
      var idRegion = '';
      if(this.forma.value.nuevoUsuarioRegion != null){
        idRegion = this.forma.value.nuevoUsuarioRegion;
      }
      var idComuna = '';
      if(this.forma.value.nuevoUsuarioComuna != null){
        idComuna = this.forma.value.nuevoUsuarioComuna;
      }
      var estamento = '';
      if(this.forma.value.nuevoUsuarioEstamento != null){
        estamento = this.forma.value.nuevoUsuarioEstamento;
      }
      var contratante = '';
      if(this.forma.value.nuevoUsuarioEntidad != null){
        contratante = this.forma.value.nuevoUsuarioEntidad;
      }
      var restoDireccion;
      if(this.forma.value.nuevoUsuarioRestoDireccion != null){
        restoDireccion = this.forma.value.nuevoUsuarioRestoDireccion;
      }
      var veReportes;
      if(this.forma.value.nuevoVerReporte.toString() != null){
        veReportes = this.forma.value.nuevoVerReporte.toString();
      }
      var password = '';
      var password2 = '';
      
      if(this.tipoDeAccion == 'Crear'){
         esNuevo = 'True'
         nombreUser = 0;
        if(this.forma.value.nuevoUsuarioContrasena1 != null){
          password = this.forma.value.nuevoUsuarioContrasena1;
        }
        if(this.forma.value.nuevoUsuarioContrasena1 != null){
          password2 = this.forma.value.nuevoUsuarioContrasena2;
        }
        if (this.forma.value.nuevoUsuarioContrasena1 != null){
          password2 = this.forma.value.nuevoUsuarioContrasena2;
        }
        if (password == null || password == ''){
          this.showToast('error', 'Password es requerida', 'Error');
          return;
        }
        if (password2 == null || password2 == ''){
          this.showToast('error', 'Repita Password es requerida', 'Error');
          return;
        }
        if (password != password2){
          this.showToast('error', 'Las contraseñas deben coincidir', 'Error');
          return;
        }
      }
      this.loading = true;
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
            if(usuarioCambiado.Datos){
              console.log(usuarioCambiado.Datos);
              console.log(usuarioCambiado.Mensaje);
              if(this.tipoDeAccion == 'Crear'){
                this.showToast('success', 'Usuario creado con éxito', 'Nuevo');
              }
              if(this.tipoDeAccion == 'Editar'){
                this.showToast('success', 'Usuario editado con éxito', 'Edición');
              }
              //actualizar la lista
              this.LoadTable();
              this.loading = false;
              //se limpian los campos 
              if(this.tipoDeAccion == 'Crear'){
                this.forma.reset({});
              }
              if(this.tipoDeAccion == 'Editar'){
                //se cierra el modal 
                 $("#modalCrearUsuario").modal("hide");
              }
            }
            else{
              //se levanta modal con error
              if(usuarioCambiado.Mensaje){
                if(usuarioCambiado.Mensaje.Codigo == '7'){
                  console.log('error');
                  this.showToast('error', 'Nombre de usuario ya existe', 'Error');  
                }
                else{
                  console.log('error');
                  this.showToast('error', usuarioCambiado.Mensaje.Texto, 'Error'); 
                }
              }
              else{
                console.log('error');
                this.showToast('error', 'Error al crear usuario', 'Error');
              }
              this.loading = false;
            }

          }
        },
        err => {
          this.showToast('error', err, 'Error');
          console.error(err);
          this.loading = false;
          },
        () => console.log('creado con exito')
      );
    }
  }
  
  obtenerRegiones(ecolId){
    //indicador valor
    this.global.postRegiones(ecolId.toString()).subscribe(
        data => {
          if (data){
            var listaRegionesR = data.json();
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
  
  // editarUsuario(usuario){
  //   this.obtenerComunas(ecolId);
  //   this.tipoDeAccion='Editar';
  //   this.usuarioEditado = usuario.Datos.NombreUsuario;
  //   console.log(this.usuarioEditado);
  //   this.forma.setValue({
  //     nuevoUsuario: usuario.Datos.NombreUsuario,
  //     nuevoUsuarioRun: usuario.Datos.Rut,
  //     nuevoUsuarioNombre:usuario.Datos.Nombres,
  //     nuevoUsuarioApellidoPat: usuario.Datos.ApellidoPaterno,
  //     nuevoUsuarioApellidoMat: '',
  //     nuevoUsuarioRegion: usuario.Datos.IdRegion,
  //     nuevoUsuarioComuna: usuario.Datos.IdComuna,
  //     nuevoUsuarioDireccion: usuario.Datos.Direccion,
  //     nuevoUsuarioRestoDireccion: usuario.Datos.RestoDireccion,
  //     nuevoUsuarioCorreo: usuario.Datos.Email,
  //     nuevoUsuarioEstamento: usuario.Datos.Estamento,
  //     nuevoUsuarioTelefonoFijo:usuario.Datos.TelefonoFijo,
  //     nuevoUsuarioTelefonoCelular: usuario.Datos.TelefonoCelular,
  //     nuevoUsuarioEntidad: usuario.Datos.Contratante,
  //     nuevoUsuarioRol: usuario.Datos.Rol,
  //     nuevoUsuarioContrasena1: '',
  //     nuevoUsuarioContrasena2: '',
  //     nuevoVerReporte: usuario.Datos.VeReportes

  //   })
  // }
  viewUser(usuario){
    console.log("ver usuario");
  }
  onChangeRegion(event){
    console.log(event.target.value);
    this.obtenerComunas(event.target.value);
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