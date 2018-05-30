import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
//Plugin
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { LoadingModule } from 'ngx-loading';


//Rutas
import { appRouting } from './app.routes';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdministracionLunComponent } from './components/administracion-lun/administracion-lun.component';
import { AdministracionWebComponent } from './components/administracion-web/administracion-web.component';
import { EditarUsuariosComponent } from './components/editar-usuarios/editar-usuarios.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { MantenedorEntidadComponent } from './components/mantenedor-entidad/mantenedor-entidad.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReportesComponent } from './components/reportes/reportes.component';


//Servicios
import { ServicioLoginService } from './services/servicio-login.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdministracionLunComponent,
    AdministracionWebComponent,
    EditarUsuariosComponent,
    FooterComponent,
    HomeComponent,
    MantenedorEntidadComponent,
    NavbarComponent,
    ReportesComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    appRouting,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    ToastModule.forRoot(),
    LoadingModule
  ],
  providers: [
    ServicioLoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
