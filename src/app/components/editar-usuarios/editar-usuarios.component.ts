import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

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
              private fb: FormBuilder
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

}
