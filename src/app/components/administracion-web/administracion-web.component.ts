import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-administracion-web',
  templateUrl: './administracion-web.component.html',
  styleUrls: ['./administracion-web.component.css']
})
export class AdministracionWebComponent implements OnInit {

  rol = sessionStorage.getItem("Rol");
  ecolId = sessionStorage.getItem("Ecol");
  token = sessionStorage.getItem("token");
  usuario = sessionStorage.getItem("UserName"); 
  nombreCompuesto = sessionStorage.getItem('Nombre') +" "+ sessionStorage.getItem('Apellido');
  contratante = sessionStorage.getItem('Contratante');



  constructor( private router: Router ) { }

  ngOnInit() {
  }

  irMantenedorWeb(){
    this.router.navigateByUrl('/editar');
  }

  irMantenedorContratante(){
    this.router.navigateByUrl('/mantenedor');
  }

}
