import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//Servicios
import { GlobalService } from '../../services/global.service';
declare var $:any;

var ecolId = sessionStorage.getItem("Ecol");
var rolUsuario = sessionStorage.getItem('Rol');

@Component({
  selector: 'app-mantenedor-entidad',
  templateUrl: './mantenedor-entidad.component.html',
  styleUrls: ['./mantenedor-entidad.component.css']
})
export class MantenedorEntidadComponent implements OnInit {
  listaContratantes;
  loading = false;
  entidadesContratantes:any;
  rolUsuario:string;
  miContratante: any;
  forma:FormGroup;
  listaContratos;
  listaRegiones;
  listaComunas;
  constructor
  (
    private fb: FormBuilder,
    private global: GlobalService,
    private toastr: ToastsManager,
    private _vcr: ViewContainerRef
  ) { 

    this.toastr.setRootViewContainerRef(_vcr);
    this.listaContratantes = [];
    this.listaComunas=[];
    this.listaRegiones=[];
    this.cargarContratos();
    this.miContratante = {
      RazonSocial: '',
      TipoContrato: '',
      TipoContratante: '0',
      Direccion: '',
      Numero: '',
      RestoDireccion: '',
      NombreRegion: '',
      NombreComuna: '',
      IdRegion: '13',
      IdComuna: '317',
      RebalseLun: {
        TotalLicenciasInicial: '0',
        Sobrecupo: '0'
      }
    };
  }
  cargarForma(){
    this.forma = new FormGroup({
      'nuevoEmpleador': new FormControl('', [Validators.required,
                                          Validators.minLength(3)]),
      'nuevoTipoContrato': new FormControl('', Validators.required),
      'nuevoUsuarioRegion': new FormControl('', Validators.required),
      'nuevoUsuarioComuna': new FormControl('', Validators.required),
      'nuevoUsuarioDireccion': new FormControl('', Validators.required),
      'nuevoUsuarioNumeroDireccion': new FormControl(),
      'nuevoUsuarioRestoDireccion': new FormControl(),
      'nuevoUsuarioSobrecupo': new FormControl('', Validators.required),
      'nuevoUsuarioTotalLicencias': new FormControl('', Validators.required)
    })
    console.log(this.forma.valid + ' ' + this.forma.status);
  }
  cargarContratos(){
    var nombrada = {
      Nombre: 'Licencia Nombrada',
      Id: 0
    };
    var reutilizable = {
      Nombre: 'Licencia Reutilizable',
      Id: 1
    };
    var onDemand = {
      Nombre: 'Licencia On Demand',
      Id: 2
    };

   this.listaContratos = [nombrada, reutilizable, onDemand];
  }
  ngOnInit() {
    this.cargaInicial();
  }
  cargaInicial(){
    this.obtenerRegiones(String(ecolId));
    if (rolUsuario == 'Super Administrador')
      this.LoadTable();
    else
      this.LoadEntidad();

   this.cargarForma();
  }
  LoadEntidad(){
    this.loading = true;
    this.global.gettEntidadContratante(String(ecolId)).subscribe(
      data => {
        this.miContratante = data.Datos;   
        var regId = this.miContratante.IdRegion;
        this.obtenerComunas(String(regId)); 
        //this.cargarForma();
        console.log(this.miContratante);
        this.loading = false;
      }
    );
  }
  LoadTable(){
    this.loading = true; 
    this.global.postEntidadesContratantes(String(ecolId)).subscribe(
      data => {
        var datosR = data.json();
        this.entidadesContratantes = datosR.Datos; 
        $(function(){
          var table = $('#tablaUserWeb').DataTable({
            columns: [
                { title: "Empleador" },
                { title: "Tipo Contrato" },
                { title: "Sobrecupo" },
                { title: "Total Licencias" }
            ],
            "language": {
              "sProcessing":     "Procesando...",
              "sLengthMenu":     "Mostrar " + "_MENU_ registros",
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
            "searching": false,
            "info": false,
            select: true,
            responsive: true,
            colReorder: true,
          });
        });       
        console.log(this.entidadesContratantes);
        this.loading = false;
      }
    );
  }
  modalEditarContratante(){
    //this.tipoDeAccion = 'Crear';
    this.forma.reset({});
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
  onChangeRegion(event){
    console.log(event.target.value);
    this.obtenerComunas(event.target.value);
  }

  editarIndividual() {
    
    //editar usuario
    
    console.log(this.miContratante);
    //vamos a cargar las comunas de acuerdo a la region
    this.cargarContratos();
    var regId = this.miContratante.IdRegion;
    this.obtenerComunas(String(regId));

    this.forma.setValue({
      nuevoEmpleador: this.miContratante.RazonSocial,
      nuevoTipoContrato: this.miContratante.TipoContratante,
      nuevoUsuarioRegion: this.miContratante.IdRegion,
      nuevoUsuarioComuna: this.miContratante.IdComuna,
      nuevoUsuarioDireccion: this.miContratante.Direccion,
      nuevoUsuarioRestoDireccion: this.miContratante.RestoDireccion,
      nuevoUsuarioNumeroDireccion: this.miContratante.Numero,
      nuevoUsuarioSobrecupo: this.miContratante.RebalseLun.Sobrecupo,
      nuevoUsuarioTotalLicencias: this.miContratante.RebalseLun.TotalLicenciasInicial
    });
    //this.cargarForma();
  }
  guardarContratante(){
    if (this.forma.valid){
      var empleador = this.forma.value.nuevoEmpleador;
      var idTipoContrato = this.forma.value.nuevoTipoContrato;
      var idRegion = this.forma.value.nuevoUsuarioRegion;
      var idComuna = this.forma.value.nuevoUsuarioComuna;
      var direccion = this.forma.value.nuevoUsuarioDireccion;
      var restoDireccion = this.forma.value.nuevoUsuarioRestoDireccion;
      var numero = this.forma.value.nuevoUsuarioNumeroDireccion;
      var sobrecupo = this.forma.value.nuevoUsuarioSobrecupo;
      var totalLicencias = this.forma.value.nuevoUsuarioTotalLicencias;

      //empezamos el loading
      this.loading = true;
      this.global.putEntidadContratante(
        empleador,
        idTipoContrato,
        idRegion,
        idComuna,
        ecolId,
        direccion,
        numero,
        restoDireccion,
        sobrecupo,
        totalLicencias
      ).subscribe(
        data => {
          
          if (data){
            var usuarioCambiado = data.json();

            //este arreglo habria que recorrerlo con un ngfor
            if (usuarioCambiado.Datos){
              console.log(usuarioCambiado.Datos);
              console.log(usuarioCambiado.Mensaje);
              //actualizamos la lista
              //this.obtenerListaUsuarios(this.usuario.AutentificacionUsuario.EcolId.toString(), this.usuario.AutentificacionUsuario.RolId.toString());
              this.cargaInicial();
              this.loading = false;
              this.showToast('success', 'Modificado con éxito', 'Modificación');  
                //cerrar modal
              $("#modalEditarContratante").modal("hide");
              
              
            }
            else{
              //levantar un modal que hubo un error
              if (usuarioCambiado.Mensaje){
                if (usuarioCambiado.Mensaje.Codigo == '7'){
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
    else{
      this.showToast('error', 'Revise campos', 'Requeridos');
    }
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

