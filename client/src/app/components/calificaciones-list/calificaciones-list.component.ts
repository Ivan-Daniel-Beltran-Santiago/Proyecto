import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Calificacion } from 'src/app/models/calificaciones';
import { AlumnosService } from 'src/app/services/alumnos/alumnos.service';
import { CalificacionesService } from 'src/app/services/calificaciones/calificaciones.service';
import { ClasesHorariosService } from 'src/app/services/clasesHorarios/clases-horarios.service';
import { AlumnoGruposService } from 'src/app/services/alumnoGrupos/alumno-grupos.service';
import { CalificacionesComponent } from '../calificaciones/calificaciones.component';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-calificaciones-list',
  templateUrl: './calificaciones-list.component.html',
  styleUrls: ['./calificaciones-list.component.css'],
})
export class CalificacionesListComponent implements AfterViewInit {
  @ViewChild('tabla', { static: false })
  tabla!: ElementRef;
  arrayAlumnos: any = [];
  arrayCalificaciones: any = [];
  arrayAllCalificaciones: any = [];
  arrayCalifAlumno: any = [];
  arrayFechas: any = [];
  arrayCalif: any = [];
  arrayClases: any = [];
  calificacion: Calificacion = {
    fecha_calif: '',
    calificacion: 0,
    id_alumno: 0,
  };
  click: boolean = false;

  
  
  
  

  filterPost = '';
  rol = this.authService.getRoleFromToken();
  id: any = this.authService.getIdFromToken();
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  promedio : number = 0.0;
  acumulador : number = 0;
  contador : number = 0;

  isAlumno: boolean = false;

  constructor(
    private alumnosService: AlumnosService,
    private calificacionesService: CalificacionesService,
    private clasesHorarioService: ClasesHorariosService,
    private alumnosGrupoService: AlumnoGruposService,
    private authService: AuthService,
    private router: Router,
    private calif: CalificacionesComponent
  ) {}
  ngAfterViewInit() {
    this.getClases();
    this.getAllCalif();
    this.alumnosService.getAlumnos().subscribe(
      (res) => {
        this.arrayAlumnos = res;
        console.log(this.arrayAlumnos[0]);
      },
      (err) => console.error(err)
    );
    console.log(this.calif.a2);

  }

  onClickButton(id: number) {
    Swal.fire({
      title: 'Assign grade ?',
      text: 'This grade will be assing to this student!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.calificacionesService
          .saveCalificacion(this.calificacion)
          .subscribe(
            (result) => {
              console.log(result);
              //this.router.navigate(['/horario']);
              Swal.fire({
                title: 'Done!',
                text: 'The grade has been added.',
                icon: 'success',
              });
            },
            (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              });
            }
          );
      }
    });
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
  getAlumnos(id: number) {
    this.click = true;
    //[routerLink]="['/calificaciones',alumno.id_user]"
    this.alumnosGrupoService.getAlumnos(id.toString()).subscribe(
      (res) => {
        this.arrayAlumnos = res;
        console.log(this.arrayAlumnos[0]);
      },
      (err) => console.error(err)
    );

    this.getCalificaciones(id);
  }
  exportarAExcel() {
    
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Horario');
   // const cell = ws["getCell"](2, 1);
    //cell.setStyle({ alignment: { horizontal: "center" } });
    XLSX.writeFile(wb, 'Calificaciones Globales.xlsx');
  }

  getAllCalif() {
    this.calificacionesService.getAllCalificaciones().subscribe(
      (res) => {
        this.arrayAllCalificaciones = res;
        for (let index = 0; index < this.arrayAllCalificaciones[0].length; index++) {
          this.acumulador = this.arrayAllCalificaciones[0][index].calificacion+ this.acumulador;
          this.contador+=1;
          
        }
        this.promedio = this.acumulador/this.contador;
        console.log(this.promedio);
        console.log(this.arrayAllCalificaciones[0]);
      },
      (err) => console.error(err)
    );
  }

  getClases() {
    if (this.rol == '1') {
      this.isAlumno = true;
      this.alumnosGrupoService.getClases(this.id).subscribe(
        (res) => {
          this.arrayClases = res;
          console.log(this.arrayClases[0]);
        },

        (err) => console.error(err)
      );
    } else if (this.rol == '2') {
      this.clasesHorarioService.getClaseHorario(this.id).subscribe(
        (res) => {
          this.arrayClases = res;
          console.log(this.arrayClases[0]);
        },

        (err) => console.error(err)
      );
    } else {
      this.clasesHorarioService.getClasesHorarios().subscribe(
        (res) => {
          this.arrayClases = res;
          console.log(this.arrayClases[0]);
        },

        (err) => console.error(err)
      );
    }
  }

  getCalificaciones(id: number) {
    const objeto: any = {};
    this.calificacionesService.getCalificaciones(id.toString()).subscribe(
      (res) => {
        this.arrayCalificaciones = res;
        for (let i = 0; i < this.arrayCalificaciones[0].length; i++) {
          objeto[i] = this.arrayCalificaciones[0][i];
          let fecha = objeto[i].fecha_calif;

          if (this.arrayFechas.length === 0) {
            this.arrayFechas.push(objeto[i].fecha_calif);
          } else {
            let fecha = objeto[i - 1].fecha_calif;
            if (!(fecha == objeto[i].fecha_calif))
              this.arrayFechas.push(objeto[i].fecha_calif);
          }

          //if (this.arrayFechas.length > 5) this.arrayFechas.splice(0, 1);
        }

        console.log(this.arrayCalificaciones[0]);
      },

      (err) => console.error(err)
    );
  }

  obtenerCalificacion(id_alumno: number, fecha: Date): any {
    const maestro = this.arrayCalificaciones[0].find(
      (m: { id_alumno: number; fecha_calif: Date }) =>
        m.id_alumno === id_alumno && m.fecha_calif === fecha
    );
    return maestro ? maestro.calificacion : '';
  }

  obtenerAlumno(id_alumno:string){
   
    const alumno = this.arrayAlumnos[0].find(
      (m: { id_user: number }) => m.id_user.toString()=== id_alumno
    );

    return alumno ? `${alumno.first_nameU} ${alumno.last_nameU}` : '';
  }

  obtenerGrupo(id_grupo:string){
    
    const grupo = this.arrayClases[0].find(
      (m: { id_grupo: number }) => m.id_grupo.toString()=== id_grupo
    );
   

    return grupo ? `${grupo.nombre_grupo}` : '';
  }
}
