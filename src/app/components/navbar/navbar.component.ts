import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn:string = 'false';
  puedeVerReporte:string;
  rolUsuario:string;

  constructor(private ref: ChangeDetectorRef) { 
    //Funcion que detecta los cambios de las variables
    if(this.isLoggedIn != 'true'){
      setInterval(()=>{
        this.isLoggedIn = sessionStorage.getItem('IsLogged');
        this.puedeVerReporte = sessionStorage.getItem('IsLogged');
        this.rolUsuario= sessionStorage.getItem('Rol');
        this.ref.detectChanges();
      }, 100);
    }
    

  }

  ngOnInit() {
  }
 

}
