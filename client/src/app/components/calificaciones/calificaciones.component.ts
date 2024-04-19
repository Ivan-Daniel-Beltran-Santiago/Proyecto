import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionesService } from 'src/app/services/calificaciones/calificaciones.service';
import { AlumnosService } from 'src/app/services/alumnos/alumnos.service';
import { Calificacion } from 'src/app/models/calificaciones';
import { Chart } from 'chart.js';
import { GrabacionesComponent } from '../grabaciones/grabaciones.component';
import 'chartjs-plugin-annotation';
import 'chartjs-plugin-datalabels';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';

import * as jspdf from 'jspdf';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css'],
})
export class CalificacionesComponent implements OnInit {
  public calificaciones: any = [];
  public calificacionesAlumno: any = [];
  public arrayAlumno: any = [];
  public fechas: any = [];
  nombreUsuario = this.authService.getNameFromToken();
  rol = this.authService.getRoleFromToken();
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  id = this.authService.getIdFromToken();
  isAlumno: boolean = false;
  nombreAlumno: any;
  promedio: number = 0.0;
  acumulador: number = 0;
  contador: number = 0;
  public a2: string = 'gvg';

  isEdit: boolean = false;
  // Array de calificaciones (debes proporcionar tus propias calificaciones)

  calificacion: Calificacion = {
    fecha_calif: '',
    calificacion: 0,
    id_alumno: 0,
    id_grupo: 0,
  };
  colorearFila: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private alumnosService: AlumnosService,
    private calificacionesService: CalificacionesService,
    private authService: AuthService,
    private router: Router,
    private grabacion: GrabacionesComponent
  ) {}
  ngOnInit() {
    this.generarGrafica();
    if (this.rol == 1) {
      this.isAlumno = true;
    }
    this.getAlumnos();
  }

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  getGrabacion(id: number, id2: string) {
    console.log(id);
    console.log(id2);

    this.router.navigate(['/grabaciones', id, id2]);
  }

  getAlumnos() {
    this.alumnosService.getAlumnos().subscribe(
      (res) => {
        this.arrayAlumno = res;
        console.log(this.arrayAlumno[0]);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '' + err.error.msg,
          footer: '<a href="#">Why do I have this issue?</a>',
        });
      }
    );
  }

  getCalificacion(idG: number, idA: number, fecha: string) {
    const objeto: any = {};
    this.isEdit = true;
    this.calificacion.id_calificacion = idG;
    this.calificacion.id_alumno = idA;
    this.calificacion.fecha_calif = fecha;
    console.log(idG);
  }

  updateCalificacion() {
    Swal.fire({
      title: 'Updating Grade?',
      text: 'This grade will be changed!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.calificacionesService
          .updateCalificacion(
            this.calificacion.id_calificacion,
            this.calificacion
          )
          .subscribe(
            (res) => {
              console.log(res);
              setTimeout(() => {
                location.reload();
              }, 2500);
            },
            (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '' + err.error.msg,
              });
            }
          );

        Swal.fire({
          title: 'Updated!',
          text: 'The grade has been updated.',
          icon: 'success',
        });
      }
    });
  }

  deleteCalificacion(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.calificacionesService.deleteCalificacion(id.toString()).subscribe(
          (res) => {
            console.log(res);
            setTimeout(() => {
              location.reload();
            }, 2500);
            this.generarGrafica();
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: '' + err.error.msg,
              footer: '<a href="#">Why do I have this issue?</a>',
            });
          }
        );
        Swal.fire({
          title: 'Deleted!',

          text: 'The grade has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  generarGrafica() {
    const objeto: any = {};
    const params = this.activatedRoute.snapshot.params;
    this.nombreAlumno = params['id'];
    console.log(this.nombreAlumno);
    this.calificacion.id_grupo = params['idG'];
    if (params['idG'] && params['id']) {
      this.calificacionesService
        .getCalificacion(params['idG'], params['id'])
        .subscribe((res) => {
          this.calificaciones = res;

          for (let i = 0; i < this.calificaciones[0].length; i++) {
            objeto[i] = this.calificaciones[0][i];
            this.calificacionesAlumno.push(
              this.calificaciones[0][i].calificacion
            );
            this.acumulador =
              this.calificaciones[0][i].calificacion + this.acumulador;
            this.contador += 1;

            if (this.fechas.length == 0) {
              this.fechas.push(
                this.calificaciones[0][i].fecha_calif.substring(15, 0)
              );
            } else {
              if (
                !(
                  this.calificaciones[0][i].fecha_calif.substring(10, 0) ==
                    this.calificaciones[0][1].fecha_revision.substring(10, 0) ||
                  this.calificaciones[0][i].fecha_calif.substring(10, 0) ==
                    this.calificaciones[0][1].fecha_final.substring(10, 0)
                )
              ) {
                this.fechas.push(
                  this.calificaciones[0][i].fecha_calif.substring(10, 0)
                );
              }
            }
          }
          this.promedio = this.acumulador / this.contador;
          console.log(this.promedio);
          //if (this.calificacionesAlumno.length > 5)
          //this.calificacionesAlumno.splice(0, 1);

          console.log(this.calificaciones[0]);
          console.log(this.fechas);
          console.log(this.calificacionesAlumno);
          //this.calificacion=objeto[0];
          //console.log(this.calificacion.id_alumno);
          const ctx = document.getElementById('myChart') as HTMLCanvasElement;

          if (this.calificacionesAlumno.length > 0) {
            this.fechas.push(
              this.calificaciones[0][0].fecha_revision.substring(10, 0) +
                '\n' +
                'Revision',
              this.calificaciones[0][0].fecha_final.substring(10, 0) +
                '\n' +
                'Examen'
            );
          }

          const myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.fechas,
              datasets: [
                {
                  label: 'Calificaciones',
                  data: this.calificacionesAlumno,
                  borderColor: 'blue',
                  //fill: false,
                },
              ],
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: 'Gráfico de Calificaciones ', // Aquí puedes especificar el título deseado
                  font: {
                    size: 16, // Tamaño de fuente del título
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0, // Comienza en 0
                  max: 100, // Valor máximo en el eje Y
                },
              },
            },
          });
        });
    }
  }

  obtenerAlumno(idAlumno: string): any {
    if (this.arrayAlumno && this.arrayAlumno.length > 0) {
      const alumno = this.arrayAlumno[0].find(
        (m: { id_user: number }) => m.id_user.toString() === idAlumno
      );

      return alumno ? `${alumno.first_nameU} ${alumno.last_nameU}` : '';
    } else {
      return '';
    }
  }

  exportarAPDF(): void {
    // Obtén el elemento canvas
    const canvas: HTMLCanvasElement | null = document.getElementById(
      'myChart'
    ) as HTMLCanvasElement;

    // Captura la representación visual del canvas usando html2canvas
    if (!canvas) {
      console.error('Elemento canvas no encontrado.');
      return;
    }

    html2canvas(canvas)
      .then((canvasCapturado) => {
        const pdf = new jspdf.jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Ajusta el tamaño y posición de la imagen en el PDF
        const imageWidth = canvasCapturado.width * 0.1; // ajusta según sea necesario
        const imageHeight = canvasCapturado.height * 0.1; // ajusta según sea necesario
        const xPos = (pdfWidth - imageWidth) / 2;
        const yPos = (pdfHeight - imageHeight) / 2;

        pdf.addImage(
          canvasCapturado.toDataURL('image/png'),
          'PNG',
          xPos,
          yPos,
          imageWidth,
          imageHeight
        );

        // Descarga el archivo PDF
        pdf.save('tu_archivo.pdf');
      })
      .catch((error) => {
        console.error('Error al capturar el canvas o generar el PDF:', error);
      });
  }
}
