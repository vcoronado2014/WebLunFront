import { Component, OnInit, ViewContainerRef, ViewChild  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

//Plugins
import { ToastsManager } from 'ng2-toastr/ng2-toastr';



//Servicios
import { ServicioLoginService } from '../../services/servicio-login.service';
import { GlobalService } from '../../services/global.service';

declare var $:any;

 

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

 rol = sessionStorage.getItem("Rol");
 ecolId = sessionStorage.getItem("Ecol");
 token = sessionStorage.getItem("token");
 usuario = sessionStorage.getItem("UserName"); 
 rutUsuario:string;
 table:any; 
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
  //usuario a eliminar
  nombreAEliminar;

  constructor( private auth: ServicioLoginService,
               private fb: FormBuilder,
               private global: GlobalService,
               private _vcr: ViewContainerRef,
               private toastr: ToastsManager){

    this.toastr.setRootViewContainerRef(_vcr);
    if (this.rol != 'Super Administrador'){
      this.listaRoles = ['Administrador Web', 'Administrador Lun', 'Consultador'];
    }
    else{
      this.listaRoles = ['Administrador Web', 'Administrador Lun', 'Consultador', 'Super Administrador'];
    }
    this.listaContratantes = [];
    this.listaRegiones = [];
    this.listaComunas = [];
    this.listaEstamentos = ['Profesional','Técnico', 'Administrativo'];

    this.forma = new FormGroup({
      'nuevoUsuario': new FormControl('', [Validators.required,Validators.minLength(3)]),
      'nuevoUsuarioRun': new FormControl('', Validators.required),
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
      'nuevoUsuarioContrasena1': new FormControl('',Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,16}$')),
      'nuevoUsuarioContrasena2': new FormControl('',Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,16}$')),
      'nuevoVerReporte':new FormControl('',[Validators.required])
    })
    console.log(this.forma);
  }

  ngOnInit() {
   this.LoadTable();
   //cargamos los demas elementos
   this.obtenerRegiones(String(this.ecolId));
   this.obtenerEntidadesContratantes(String(this.ecolId));
 }

  LoadTable(){
    this.loading = true; 
    this.auth.getUsersWeb(sessionStorage.getItem("Rol"),String(this.ecolId),this.token,this.usuario).subscribe(
      data => {
        this.users = data.Datos; 
        $(function(){
          this.table = $('#tablaUserWeb').DataTable({
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
            dom: 'Bfrtip',
            buttons: [
                {
                  extend: 'excelHtml5', 
                  className:'excelBtn',
                  text: 'Excel',
                  exportOptions: {
                    modifier: {
                        page: 'current',
                        columns: [ 0, 1, 2, 3, 4, 5 ]
                    }
                }
              },
              'colvis'
            ]
          });
        });       
        console.log(this.users);
        this.loading = false;
      }
    );
  }
  cargarEstamentos(){
    this.listaEstamentos = ['Profesional','Técnico', 'Administrativo'];
  }

  modalCrearUsuario(){
    this.tipoDeAccion = 'Crear';
    this.activar(this.tipoDeAccion + ' Usuario');
    this.forma.reset({});
  }

  guardarUsuario(){
      //se construye los elementos a guardar
      var expreg = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,16}$/;
      var nombreContratante = $('#optContratante').text();
      var nombreUsuario = this.forma.value.nuevoUsuario;
      var ecolId = this.forma.value.nuevoUsuarioEntidad.toString();
      var rolId = this.forma.value.nuevoUsuarioRol.toString();
      var nombres = this.forma.value.nuevoUsuarioNombre;
      var apellidoPaterno = this.forma.value.nuevoUsuarioApellidoPat;
      var apellidoMaterno = this.forma.value.nuevoUsuarioApellidoMat;
      var usuarioCreador = sessionStorage.getItem('UserName');
      var email = this.forma.value.nuevoUsuarioCorreo;
      var esNuevo;
      var nombreUser;
      var password = this.forma.value.nuevoUsuarioContrasena1;
      var password2 = this.forma.value.nuevoUsuarioContrasena2;
      var telefonoFijo = this.forma.value.nuevoUsuarioTelefonoFijo;
      var telefonoCelular = this.forma.value.nuevoUsuarioTelefonoCelular;
      var rut = this.forma.value.nuevoUsuarioRun;
      var direccion = this.forma.value.nuevoUsuarioDireccion;
      var restoDireccion = this.forma.value.nuevoUsuarioRestoDireccion;
      var idRegion = this.forma.value.nuevoUsuarioRegion;
      var idComuna = this.forma.value.nuevoUsuarioComuna;
      var estamento = this.forma.value.nuevoUsuarioEstamento;
      var contratante = this.forma.value.nuevoUsuarioEntidad;
      var veReportes = this.forma.value.nuevoVerReporte;
      //validacion de campos
      if(apellidoPaterno == null || apellidoPaterno == ''){
        this.showToast('error', 'El apellido es requerido', 'Error');
        return;
      }
      if (email == null || email == ''){
        this.showToast('error', 'Email es requerido', 'Error');
        return;
      }      
      if( telefonoCelular == null || telefonoCelular == ''){
        this.showToast('error', 'El teléfono es requerido', 'Error');
        return;
      }else if(telefonoCelular.length < 9){
        this.showToast('error', 'El teléfono debe contener mínimo 9 dígitos', 'Error');
        return;
      }
      if( rut == null || rut == ''){
        this.showToast('error', 'El run es requerido', 'Error');
        return;
      }
      if( direccion == null || direccion == ''){
        this.showToast('error', 'Dirección es requerida', 'Error');
          return;
      }
      if( restoDireccion == null || restoDireccion == '' ){
        this.showToast('error', 'Resto dirección requerido', 'Error');
        return;
      }     
      if( idRegion == null || idRegion == ''){
        this.showToast('error', 'Región es requerida', 'Error');
        return;
      }      
      if( idComuna == null || idComuna == ''){
        this.showToast('error', 'Comuna es requerida', 'Error');
        return;
      }      
      if( estamento == null || estamento == ''){
        this.showToast('error', 'Estamento es requerida', 'Error');
        return;
      }
      if( contratante == null || contratante == ''){
        this.showToast('error', 'Entidad Contratante es requerida', 'Error');
        return;
      }      
      if(this.tipoDeAccion == 'Crear'){
         esNuevo = 'True'
         nombreUser = 0;
        if(expreg.test(password) != true){
          this.showToast('error', 'La contraseña debe ser segura', 'Error');
          return;
        }
        if(password != password2){
          this.showToast('error', 'Las contraseñas deben coincidir', 'Error');
          return;
        }
        if(password == null && password2 == null || password == '' && password2 == '' ){
          this.showToast('error', 'Contraseña requerida', 'Error');
          return;
        }
        if(veReportes == null){
          veReportes = "false"
        }
      }
      if(this.tipoDeAccion == 'Editar'){
        nombreUser = this.usuarioEditado;
        esNuevo = 'False'
        if(password){
          if(expreg.test(password) != true){
            this.showToast('error', 'La contraseña debe ser segura', 'Error');
            return;
          }
          if(password != password2){
            this.showToast('error', 'Las contraseñas deben coincidir', 'Error');
            return;
          }
        }
      }
      this.loading = true;
      this.auth.createModifyWebUser(
        esNuevo,
        nombreUsuario,
        email,
        password,
        rolId, 
        String(ecolId),
        apellidoPaterno,
        apellidoMaterno,
        direccion,
        String(idRegion),
        String(idComuna),
        nombres,
        rut,
        estamento,
        nombreContratante,
        String(veReportes),
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
              this.destroyTable();
              this.loading = true;
              this.LoadTable();
              this.loading = false;
              //se limpian los campos 
              if(this.tipoDeAccion == 'Crear'){
                this.forma.reset({});
                $("#modalCrearUsuario").modal("hide");
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
    // }
  }
  
  destroyTable(){
    $('#tablaUserWeb').DataTable().destroy();
  };

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
    this.global.postEntidadesContratantes(ecolId.toString(), this.token, this.usuario).subscribe(
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
  
  soloLectura(){
    //bloquear todo
    $("#inputNombreUsuario").attr("disabled", "disabled"); 
    $("#inputRun").attr("disabled", "disabled"); 
    $("#inputEntidad").attr("disabled", "disabled"); 
    $("#inputRol").attr("disabled", "disabled"); 
    $("#inputReporte").attr("disabled", "disabled"); 
    $("#inputNombre").attr("disabled", "disabled"); 
    $("#inputApellidoPaterno").attr("disabled", "disabled"); 
    $("#inputApellidoMaterno").attr("disabled", "disabled"); 
    $("#inputRegion1").attr("disabled", "disabled"); 
    $("#inputComuna").attr("disabled", "disabled"); 
    $("#inputDireccion").attr("disabled", "disabled"); 
    $("#telefono1").attr("disabled", "disabled"); 
    $("#telefono2").attr("disabled", "disabled"); 
    $("#inputEmail").attr("disabled", "disabled"); 
    $("#contrasena1").attr("disabled", "disabled"); 
    $("#contrasena2").attr("disabled", "disabled"); 
    $("#inputRestoDireccion").attr("disabled", "disabled"); 
    $("#inputEstamento").attr("disabled", "disabled"); 

    $("#exampleModalLabel").text("Información");
    $("#btnGuardar").hide();
    $("#lblInfoPass").hide();
    $("#lblInfoPass2").hide();
    $("#lblInfoPass3").hide();
}
activar(titulo){
  //bloquear todo
  $("#inputNombreUsuario").attr("disabled", false); 
  $("#inputRun").attr("disabled", false); 
  $("#inputEntidad").attr("disabled", false); 
  $("#inputRol").attr("disabled", false); 
  $("#inputReporte").attr("disabled", false); 
  $("#inputNombre").attr("disabled", false); 
  $("#inputApellidoPaterno").attr("disabled", false); 
  $("#inputApellidoMaterno").attr("disabled", false); 
  $("#inputRegion1").attr("disabled", false); 
  $("#inputComuna").attr("disabled", false); 
  $("#inputDireccion").attr("disabled", false); 
  $("#telefono1").attr("disabled", false); 
  $("#telefono2").attr("disabled", false); 
  $("#inputEmail").attr("disabled", false); 
  $("#contrasena1").attr("disabled", false); 
  $("#contrasena2").attr("disabled", false); 
  $("#inputRestoDireccion").attr("disabled", false); 
  $("#inputEstamento").attr("disabled", false); 

  $("#exampleModalLabel").text(titulo);
  $("#btnGuardar").show();
  $("#lblInfoPass").show();
  $("#lblInfoPass2").show();
  $("#lblInfoPass3").show();
}

  editarUsuario(usuario, mostrar){
    this.cargarEstamentos();
    this.obtenerEntidadesContratantes(this.ecolId);
    this.obtenerRegiones(this.ecolId);
    this.obtenerComunas(usuario.IdRegion);
    this.tipoDeAccion='Editar';
    this.usuarioEditado = usuario.NombreUsuario;
    console.log(this.usuarioEditado);
    this.forma.setValue({
      nuevoUsuario: usuario.NombreUsuario,
      nuevoUsuarioRun: usuario.Rut,
      nuevoUsuarioNombre:usuario.Nombres,
      nuevoUsuarioApellidoPat: usuario.ApellidoPaterno,
      nuevoUsuarioApellidoMat: usuario.ApellidoMaterno,
      nuevoUsuarioRegion: usuario.IdRegion,
      nuevoUsuarioComuna: usuario.IdComuna,
      nuevoUsuarioDireccion: usuario.Direccion,
      nuevoUsuarioRestoDireccion: usuario.RestoDireccion,
      nuevoUsuarioCorreo: usuario.Emmail,
      nuevoUsuarioEstamento: usuario.Estamento,
      nuevoUsuarioTelefonoFijo:usuario.TelefonoFijo,
      nuevoUsuarioTelefonoCelular: usuario.TelefonoCelular,
      nuevoUsuarioEntidad: usuario.EncoId,
      nuevoUsuarioRol: usuario.RolesUsuarios[0],
      nuevoUsuarioContrasena1: '',
      nuevoUsuarioContrasena2: '',
      nuevoVerReporte: usuario.VeReportes

    });

    if (mostrar == 'ver'){
      this.soloLectura();
    }
    else{
      this.activar(this.tipoDeAccion + ' Usuario');
    }
    if (this.tipoDeAccion == 'Editar'){
      $("#inputNombreUsuario").attr("disabled", "disabled"); 
    }
    else {
      $("#inputNombreUsuario").attr("disabled", false); 
    }
  }

   
  //Eliminar usuario
  //Modal Options
  options: any = {
     confirmBtnClass: 'btn btn-success',      //DEFAULT VALUE
     confirmBtnText: 'Confirmar',      				//DEFAULT VALUE
     cancelBtnClass: 'btn btn-danger',      //DEFAULT VALUE
     cancelBtnText: 'Cancelar',      				//DEFAULT VALUE
     modalSize: 'lg',      							 //DEFAULT VALUE
     modalClass: ''      								//DEFAULT VALUE
    }
    message:any = 'Al eliminar este usuario no podrá volver a ingresar.';
    title:any = '¿Estas seguro de eliminar a este usuario?';
 
  confirmed(usuario) {
    console.log(usuario.Nombres +' eliminado');
    this.loading = true;
    console.log(usuario.NombreUsuario)
    this.auth.deleteUser(usuario).subscribe(
      data => {
        this.loading = false;
          if (data){
          var usuarioCambiado = data.json();

          if (usuarioCambiado.Datos){

            console.log(usuarioCambiado.Datos);
            console.log(usuarioCambiado.Mensaje);

            this.showToast('success', 'Usuario eliminado con éxito', 'Eliminado');
            this.loading = true;
            //actualizamos la lista
            this.destroyTable();                    
            this.LoadTable();
            this.loading = false;
          } 
          else{
            //levantar un modal que hubo un error
            console.log('error');
            this.showToast('error', 'Error al eliminar usuario', 'Usuarios');
          }

        }
      },
      err => {
        this.showToast('error', err, 'Usuarios');
        console.error(err);
        },
      () => console.log('get info contratantes')
    );
  }
 
  cancelled() {
   console.log('cancelled');
  }
   onChangeRegion(event){
    console.log(event.target.value);
    this.obtenerComunas(event.target.value);
  }

  formatoRut(){
    var valor = this.rutUsuario;
     // Aislar Cuerpo y Dígito Verificador
    var cuerpo = valor.slice(0,-1);
    var dv = valor.slice(-1);

    this.rutUsuario = cuerpo + '-'+ dv;
    console.log(this.rutUsuario);
   
    return this.rutUsuario;
  };

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