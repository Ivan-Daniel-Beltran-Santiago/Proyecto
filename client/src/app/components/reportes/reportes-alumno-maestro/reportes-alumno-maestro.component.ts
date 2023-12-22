import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { ReportesService } from 'src/app/services/reportes/reportes.service';

@Component({
  selector: 'app-reportes-alumno-maestro',
  templateUrl: './reportes-alumno-maestro.component.html',
  styleUrls: ['./reportes-alumno-maestro.component.css']
})
export class ReportesAlumnoMaestroComponent {
  arrayAlumnos: any = [];
  arrayClases: any = [];
  arrayMaestros: any = [];
  arrayNumeroAlumnos: any = [];
  arrayNumeroAlumnosGrupo: any = [];
  arrayGrupos: any = [];

  rol = this.authService.getRoleFromToken();
  id: any = this.authService.getIdFromToken();
  isAlumno: boolean = false;
  isMaestro = this.authService.isMaestro();
  isAdmin = this.authService.isAdmin();
  nombreUsuario = this.authService.getNameFromToken();

  constructor(
    private authService: AuthService,
    private router: Router,
    private reporteService: ReportesService,
    private activatedRoute: ActivatedRoute
  ) {}

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  ngAfterViewInit() {
    const params = this.activatedRoute.snapshot.params;
    
      this.generarGrafica();
 
  }

  generarGrafica() {
    const objeto: any = {};
    const params = this.activatedRoute.snapshot.params;
      this.reporteService.getAlumno_Maestros().subscribe(
        (res) => {
          this.arrayAlumnos = res;
          for (let index = 0; index < this.arrayAlumnos[0].length; index++) {
            objeto[index] = this.arrayAlumnos[0][index];
            this.arrayNumeroAlumnos.push(
              this.arrayAlumnos[0][index].total_alumnos
            );
            this.arrayMaestros.push(this.arrayAlumnos[0][index].first_nameU);
          }
          console.log(this.arrayNumeroAlumnos);
          console.log(this.arrayMaestros);
          console.log(this.arrayAlumnos[0]);
        },

        (err) => console.error(err.error.msg)
      );
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.arrayMaestros,
          datasets: [
            {
              label: 'Numero de Alumnos',
              data: this.arrayNumeroAlumnos,
              backgroundColor: 'blue',
              borderColor: 'blue',
              //fill: false,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Numero de Alumnos por Maestro ', // Aquí puedes especificar el título deseado
              font: {
                size: 16, // Tamaño de fuente del título
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0, // Comienza en 0
              max: 30, // Valor máximo en el eje Y
            },
          },
        },
      });
    
  }


}


