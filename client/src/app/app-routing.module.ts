import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { RegisterComponent } from './components/register/register.component';
import { MaestrosComponent } from './components/maestros/maestros.component';
import { AdminComponent } from './components/admin/admin.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { UsersComponent } from './components/users/users.component';
import { MaestrosListComponent } from './components/maestros-list/maestros-list.component';
import { AlumnosListComponent } from './components/alumnos-list/alumnos-list.component';
import { HorariosFormComponent } from './components/horarios-form/horarios-form.component';
import { UpdateFormComponent } from './components/update-form/update-form.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { CalificacionesFormComponent } from './components/calificaciones-form/calificaciones-form.component';
import { CalificacionesComponent } from './components/calificaciones/calificaciones.component';
import { CalificacionesListComponent } from './components/calificaciones-list/calificaciones-list.component';
import { ClasesComponent } from './components/clases/clases.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { GrabacionesComponent } from './components/grabaciones/grabaciones.component';
import { MaterialesComponent } from './components/materiales/materiales.component';
import { ClasesListComponent } from './components/clases-list/clases-list.component';
import { adminGuardGuard } from './guards/admin-guard.guard';
import { maestroGuardGuard } from './guards/maestro-guard.guard';
import { alumnoGuardGuard } from './guards/alumno-guard.guard';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReportesAlumnoMaestroComponent } from './components/reportes/reportes-alumno-maestro/reportes-alumno-maestro.component';
import { ReportesAlumnoGrupoComponent } from './components/reportes/reportes-alumno-grupo/reportes-alumno-grupo.component';
import { ReportesHorasMaestrosComponent } from './components/reportes/reportes-horas-maestros/reportes-horas-maestros.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'alumnos',
    component: AlumnosComponent,
    canActivate: [alumnoGuardGuard],
  },
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'update',
    component: UpdateFormComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'maestros',
    component: MaestrosComponent,
    canActivate: [maestroGuardGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'horarios',
    component: HorariosComponent,
  },
  {
    path: 'horarios-form',
    component: HorariosFormComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'clases-list',
    component: ClasesComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'clases',
    component: ClasesListComponent,
  },
  {
    path: 'grupos',
    component: GruposComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'cursos',
    component: CursosComponent,
    canActivate: [adminGuardGuard],
  },
  { path: 'grabaciones', component: GrabacionesComponent },
  { path: 'grabaciones/:id/:id2', component: GrabacionesComponent },
  { path: 'materiales', component: MaterialesComponent },
  {
    path: 'usuarios-list',
    component: UsersComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'admins-list',
    component: AdminListComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'maestros-list',
    component: MaestrosListComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'alumnos-list',
    component: AlumnosListComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'calificaciones-form/:id',
    component: CalificacionesFormComponent,
  },
  {
    path: 'calificaciones-list',
    component: CalificacionesListComponent,
  },
  {
    path: 'calificaciones/:idG/:id',
    component: CalificacionesComponent,
  },
  {
    path: 'usuario/update/:id',
    component: RegisterComponent,
  },
  {
    path: 'horarios/update/:id',
    component: HorariosFormComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'admin/update/:id',
    component: UpdateFormComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'alumno/update/:id',
    component: UpdateFormComponent,
  },
  {
    path: 'maestro/update/:id',
    component: UpdateFormComponent,
  },
  {
    path: 'reportes',
    component: ReportesComponent,
  },
  {
    path: 'reportes/alumnoGpo',
    component: ReportesAlumnoGrupoComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'reportes/alumnoMto',
    component: ReportesAlumnoMaestroComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: 'reportes/horasMto',
    component: ReportesHorasMaestrosComponent,
    canActivate: [adminGuardGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
