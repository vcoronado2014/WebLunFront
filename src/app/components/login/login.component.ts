import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { HttpErrorResponse } from '@angular/common/http';

//Componentes



//Plugin
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


//Servicios
import { ServicioLoginService } from '../../services/servicio-login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  loginUsuario:string;
  loginContrasena:string;
  isLogged; 
  rol;
  roles = {
    adminWeb:"Administrador Web",
    adminLun:"Administrador Lun",
    consultor: "Consultador Lun",
    superAdmin: "Super Administrador"
  }

  constructor( private auth: ServicioLoginService,
               private router: Router,
               private toastr: ToastsManager,
               private _vcr: ViewContainerRef,) { 

    this.toastr.setRootViewContainerRef(_vcr);

  }

  ngOnInit(){}

  IniciarSesion(){

    if (!this.loginUsuario ){
      return this.showToast('error','Nombre de usuario requerido','Error');
    }
    if(!this.loginContrasena){
        
      return this.showToast('error','Contraseña requerida','Error');
    }
    this.loading = true;
    this.auth.login(this.loginUsuario,this.loginContrasena).subscribe(
      rs=> {
        this.loading = false;
        this.isLogged = rs;
        this.rol = sessionStorage.getItem("Rol");
        console.log(this.isLogged);
        sessionStorage.setItem('IsLogged', this.isLogged);
        console.log(this.roles.adminWeb);
        console.log(this.rol);
      },
      er => {
        this.loading = false;
        console.log('incorrecto' + er);
        this.showToast('error',this.auth.mensajeError,'Error'); 
      },
      () => {
        if(this.isLogged && this.rol == this.roles.adminWeb || this.rol.superAdmin){
          //correcto
          console.log('Correcto administrador web');
          this.router.navigateByUrl('/administracion-web')
          .then(data => console.log(data),
            error =>{
              console.log(error);
            }
          )
        }
        else if(this.isLogged && this.rol == this.roles.adminLun){
          //correcto
          console.log('Correcto administrador lun');
          this.router.navigateByUrl('/administracion-lun')
          .then(data => console.log(data),
            error =>{
              console.log(error);
            }
          )
        }
        else if(this.isLogged && this.rol == this.roles.consultor){
          //correcto
          console.log('Correcto Consultor lun');
          this.router.navigateByUrl('/reportes')
          .then(data => console.log(data),
            error =>{
              console.log(error);
            }
          )
        }
        else{
          //incorrecto
          console.log('Incorrecto');
          this.showToast('error',this.auth.mensajeError,'Error');
        }
      }
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
