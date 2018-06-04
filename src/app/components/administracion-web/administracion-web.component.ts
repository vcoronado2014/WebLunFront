import { Component, OnInit } from '@angular/core';

//Servicios
import { ServicioLoginService } from '../../services/servicio-login.service';

@Component({
  selector: 'app-administracion-web',
  templateUrl: './administracion-web.component.html',
  styleUrls: ['./administracion-web.component.css']
})
export class AdministracionWebComponent implements OnInit {

  constructor(private auth: ServicioLoginService) { }

  ngOnInit() {
    
  }

}
