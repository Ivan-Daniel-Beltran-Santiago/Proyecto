import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { ReportesService } from 'src/app/services/reportes/reportes.service';

@Component({
  selector: 'app-reportes-alumno-grupo',
  templateUrl: './reportes-alumno-grupo.component.html',
  styleUrls: ['./reportes-alumno-grupo.component.css'],
})
export class ReportesAlumnoGrupoComponent implements AfterViewInit {
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
  ngAfterViewInit(): void {
    this.generarGrafica2();
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
  generarGrafica2() {
    const objeto: any = {};
    this.reporteService.getAlumno_Grupos().subscribe(
      (res) => {
        this.arrayAlumnos = res;

        for (let index = 0; index < this.arrayAlumnos[0].length; index++) {
          objeto[index] = this.arrayAlumnos[0][index];
          this.arrayNumeroAlumnosGrupo.push(
            this.arrayAlumnos[0][index].total_alumnos
          );
          this.arrayGrupos.push(
            this.arrayAlumnos[0][index].nombre_grupo +
              `\n` +
              this.arrayAlumnos[0][index].Idioma
          );
        }

        console.log(this.arrayNumeroAlumnosGrupo);
        console.log(this.arrayGrupos);
        console.log(this.arrayAlumnos[0]);
      },

      (err) => console.error(err.error.msg)
    );
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.arrayGrupos,
        datasets: [
          {
            label: 'Numero de Alumnos',
            data: this.arrayNumeroAlumnosGrupo,
            backgroundColor: 'blue',
            borderColor: 'white',
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Numero de Alumnos por Grupo ',
            font: {
              size: 16,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 30,
          },
        },
      },
    });
  }
}
