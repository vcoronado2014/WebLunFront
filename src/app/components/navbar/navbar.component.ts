import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { ServicioLoginService } from '../../services/servicio-login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn:string = 'false';
  puedeVerReporte:string;
  rolUsuario:string;
  UserName:string;

  constructor(private ref: ChangeDetectorRef,
              private auth: ServicioLoginService,
              private router: Router) { 
    //Funcion que detecta los cambios de las variables
    if(this.isLoggedIn != 'true'){
      setInterval(()=>{
        this.isLoggedIn = sessionStorage.getItem('IsLogged');
        this.puedeVerReporte = sessionStorage.getItem('IsLogged');
        this.rolUsuario= sessionStorage.getItem('Rol');
        this.UserName= sessionStorage.getItem('UserName');
        this.ref.detectChanges();
      }, 100);
    }
    

  }

  ngOnInit() {
  }
 
  logout(){
    this.auth.logout();
    console.log('cerrar sesion');
    this.router.navigate(['/login'])
    .then(data => console.log(data),
      error => {
        console.log(error);
        
      }
    )
  }

}
