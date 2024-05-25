import { Component, OnInit } from '@angular/core';
import { ClasesHorariosService } from 'src/app/services/clasesHorarios/clases-horarios.service';
import { MaestrosService } from 'src/app/services/maestros/maestros.service';
import { AlumnoGruposService } from 'src/app/services/alumnoGrupos/alumno-grupos.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Grupo } from 'src/app/models/grupos';
import { Clase } from 'src/app/models/clases';

@Component({
  selector: 'app-clases-list',
  templateUrl: './clases-list.component.html',
  styleUrls: ['./clases-list.component.css'],
})
export class ClasesListComponent implements OnInit {
  arrayClases: any = [];
  arrayMaestros: any = [];
  arrayAlumnos: any = [];
  arrayAlumnos_Baja: any = [];
  id: number = 0;
  idU: any = this.authService.getIdFromToken();
  rol = this.authService.getRoleFromToken();
  click: boolean = false;
  agregarGrupo: boolean = false;
  idGrupo: any;
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  isAlumno = this.authService.isAlumno();

  grupo: Grupo = {
    nombre_grupo: '',
    fecha_inicio: '',
    fecha_revision: '',
    fecha_final: '',
  };

  clase: Clase = {
    id_grupo: 0,
    id_alumno: 0,
    fecha_baja: '',
    fecha_inscripcion: '',
  };

  constructor(
    private clasesHorarioService: ClasesHorariosService,
    private router: Router,
    private authService: AuthService,
    private maestroService: MaestrosService,
    private alumnoGrupoService: AlumnoGruposService
  ) {}

  ngOnInit() {
    this.getClases();
    this.getMaestro();
    this.getAlumnosBaja();
    this.fechaHoy();
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  fechaHoy() {
    const fechaOriginal: Date = new Date();
    if (fechaOriginal !== undefined) {
      const año: number = fechaOriginal.getFullYear();
      const mes: string = String(fechaOriginal.getMonth() + 1).padStart(2, '0');
      const día: string = String(fechaOriginal.getDate()).padStart(2, '0');
      const fechaFormateada: string = `${año}-${mes}-${día}`;
      console.log(fechaFormateada);
      this.clase.fecha_baja = fechaFormateada;
    }
  }

  getClases() {
    if (this.rol == '1') {
      this.alumnoGrupoService.getClases(this.idU).subscribe(
        (res) => {
          this.arrayClases = res;
          console.log(this.arrayClases[0]);
        },

        (err) => console.error(err)
      );
    } else if (this.rol == '2') {
      this.clasesHorarioService.getClaseHorario(this.idU).subscribe(
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

  copiarGrupo(id: number) {
    this.agregarGrupo = true;
    this.idGrupo = id;
  }

  agregarGrupoNuevo() {
    console.log(this.idGrupo);
    this.clasesHorarioService
      .postNuevoGrupoCopiado(this.idGrupo.toString(), this.grupo)
      .subscribe(
        (res) => {
          console.log(res);
          location.reload();
        },
        (err) => console.error(err)
      );
  }

  getMaestro() {
    this.maestroService.getMaestros().subscribe(
      (res) => {
        this.arrayMaestros = res;
        console.log(this.arrayMaestros[0]);
      },
      (err) => console.error(err)
    );
  }

  getAlumnos(id: number) {
    this.click = true;

    this.alumnoGrupoService.getAlumnos(id.toString()).subscribe(
      (res) => {
        this.arrayAlumnos = res;
        console.log(this.arrayAlumnos[0]);
      },
      (err) => console.error(err)
    );
  }

  getAlumnosBaja() {
    this.alumnoGrupoService.getAlumnosBaja().subscribe(
      (res) => {
        this.arrayAlumnos_Baja = res;
        console.log(this.arrayAlumnos_Baja[0]);
      },
      (err) => console.error(err)
    );
  }

  reinscribir(id: number, idG: number) {
    Swal.fire({
      title: 'Reinscribir Alumno?',
      text: 'This student will be !',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,!',
    }).then((result) => {
      if (result.isConfirmed) {
        const fechaOriginal: Date = new Date();
        if (fechaOriginal !== undefined) {
          const año: number = fechaOriginal.getFullYear();
          const mes: string = String(fechaOriginal.getMonth() + 1).padStart(
            2,
            '0'
          );
          const día: string = String(fechaOriginal.getDate()).padStart(2, '0');
          const fechaFormateada: string = `${año}-${mes}-${día}`;
          console.log(fechaFormateada);
          this.clase.fecha_inscripcion = fechaFormateada;
        }

        this.alumnoGrupoService
          .reinscribirAlumnoClase(
            this.clase.fecha_inscripcion,
            id.toString(),
            idG.toString()
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
                footer: '<a href="#">Why do I have this issue?</a>',
              });
            }
          );
        Swal.fire({
          title: 'Re inscrito!',

          text: 'The user has been re inscrito.',
          icon: 'success',
        });
      }
    });
  }

  borrarAlumno(id: number, idG: number) {
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
        this.alumnoGrupoService
          .deleteAlumnoClase(
            id.toString(),
            idG.toString(),
            this.clase.fecha_baja
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
                footer: '<a href="#">Why do I have this issue?</a>',
              });
            }
          );
        Swal.fire({
          title: 'Deleted!',

          text: 'The user has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  obtenerNombreMaestro(idMaestro: number): string {
    if (this.arrayMaestros && this.arrayMaestros[0]) {
      const maestro = this.arrayMaestros[0].find(
        (m: { id_user: number }) => m.id_user === idMaestro
      );
      return maestro
        ? `${maestro.first_nameU} ${maestro.last_nameU}`
        : 'Maestro no encontrado';
    } else {
      return 'Maestro no encontrado';
    }
  }

  obtenerNombreMaestro2(idMaestro: number): string {
    if (this.arrayMaestros && this.arrayMaestros[0]) {
      const maestro = this.arrayMaestros[0].find(
        (m: { id_user: number }) => m.id_user === idMaestro
      );
      return maestro
        ? `${maestro.first_nameU} ${maestro.last_nameU}`
        : 'Maestro no encontrado';
    } else {
      return 'Maestro no encontrado';
    }
  }
}
