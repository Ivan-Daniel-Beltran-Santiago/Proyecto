import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
@Component({
  selector: 'app-reportes-horas-maestros',
  templateUrl: './reportes-horas-maestros.component.html',
  styleUrls: ['./reportes-horas-maestros.component.css'],
})
export class ReportesHorasMaestrosComponent {
  arrayHorasMaestros: any = [];
  arraySueldos: any = [];
  filterPost = '';
  nombreUsuario = this.authService.getNameFromToken();
  rol = this.authService.getRoleFromToken();
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  isAlumno: boolean = false;
  mostrar: boolean = false;
  sueldo: number = 0;
  constructor(
    private authService: AuthService,
    private router: Router,
    private reportesService: ReportesService
  ) {}

  ngOnInit() {
    this.getMaestro();
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  getMaestro() {
    this.reportesService.getHoras_Maestro().subscribe(
      (res) => {
        this.arrayHorasMaestros = res;
        console.log(this.arrayHorasMaestros[0]);
      },

      (err) => console.error(err)
    );
  }

  getSueldo() {
    this.mostrar = true;
    console.log(this.sueldo);
    this.reportesService.getHoras_Maestro().subscribe(
      (res) => {
        this.arraySueldos = res;

        for (let index = 0; index < this.arraySueldos[0].length; index++) {
          this.arraySueldos[0][index].total_horas =
            this.arrayHorasMaestros[0][index].total_horas * this.sueldo;
        }

        console.log(this.arraySueldos[0]);
      },

      (err) => console.error(err)
    );
  }
}
