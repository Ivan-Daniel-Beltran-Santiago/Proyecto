import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlumnosService } from 'src/app/services/alumnos/alumnos.service';
import { CalificacionesService } from 'src/app/services/calificaciones/calificaciones.service';
import { AlumnoGruposService } from 'src/app/services/alumnoGrupos/alumno-grupos.service';
import { Calificacion } from 'src/app/models/calificaciones';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-calificaciones-form',
  templateUrl: './calificaciones-form.component.html',
  styleUrls: ['./calificaciones-form.component.css'],
})
export class CalificacionesFormComponent implements AfterViewInit {
  @ViewChildren('myElement') myElements: QueryList<ElementRef> | undefined;
  arrayAlumnos: any = [];
  fechas: Date[] = [];
  diasAgregados = 6;
  nombreUsuario = this.authService.getNameFromToken();
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  id = this.authService.getIdFromToken();

  calificacion: Calificacion = {
    fecha_calif: '',
    calificacion: 0,
    id_alumno: 0,
  };

  constructor(
    private datepipe: DatePipe,
    private alumnosService: AlumnosService,
    private calificacionService: CalificacionesService,
    private formBuilder: FormBuilder,
    private alumnosGruposService: AlumnoGruposService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.calificacion.id_grupo = params['id'];
      this.alumnosGruposService.getAlumnos(params['id']).subscribe((res) => {
        this.arrayAlumnos = res;

        console.log(this.arrayAlumnos[0]);
      });
    }

    if (this.myElements) {
      // Acceder a cada input de manera individual
      this.myElements.forEach((element, index) => {
        console.log(
          `Valor del input ${index + 1}: ${element.nativeElement.value}`
        );
      });
    }
  }

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  crearArrayDeFechas() {
    const hoy = new Date();
    for (let i = 0; i <= this.diasAgregados; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      this.fechas.push(fecha);
    }
    console.log(this.fechas);
  }

  saveCalificacion() {
    const params = this.activatedRoute.snapshot.params;
    let vacios: number = 0;
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
        if (params['id']) {
          this.calificacion.id_grupo = params['id'];
          this.alumnosGruposService
            .getAlumnos(params['id'])
            .subscribe((res) => {
              this.arrayAlumnos = res;

              for (let i = 0; i <= this.arrayAlumnos[0].length; i++) {
                if (
                  this.arrayAlumnos[0][i] &&
                  this.arrayAlumnos[0][i].id_user
                ) {
                  this.calificacion.id_alumno = this.arrayAlumnos[0][i].id_user;
                  // Resto del código aquí
                  if (this.myElements && this.myElements.first) {
                    for (let i = 0; i < this.myElements.length; i++) {
                      const element =
                        this.myElements.toArray()[i]?.nativeElement.value;
                      if (element == '' || element == null) {
                        vacios = vacios + 1;
                      }
                    }
                    if (vacios == 0) {
                      const inputValue =
                        this.myElements.toArray()[i]?.nativeElement.value;

                      this.calificacion.calificacion = inputValue;
                      console.log('Valor del input:', inputValue);

                      this.calificacionService
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
                              text: '' + err.error.msg,
                            });
                          }
                        );
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Falta calificaciones por asignar o error en el formato',
                      });
                    }

                    // Haz lo que necesites con el valor obtenido
                  }
                } else {
                  console.log('Alumno sin id_user:', this.arrayAlumnos[0][i]);
                }
              }
            });
        }
      }
    });
  }
}
