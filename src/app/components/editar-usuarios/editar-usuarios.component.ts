import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
//servicios
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

  listaRoles;
  listaContratantes;
  listaRegiones;
  listaComunas;
  listaEstamentos;
  tipoDeAccion:string;
   //formulario
  forma:FormGroup;

  constructor(
              private fb: FormBuilder,
              private global: GlobalService,
              private toastr: ToastsManager,
  ) { 
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
