import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Clase } from 'src/app/models/clases';
import { Grupo } from 'src/app/models/grupos';
import { AlumnosService } from 'src/app/services/alumnos/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros/maestros.service';
import { GruposService } from 'src/app/services/grupos/grupos.service';
import { ClasesService } from 'src/app/services/clases/clases.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css'],
})
export class ClasesComponent implements OnInit {
  arrayMaestros: any = [];
  arrayAlumnos: any = [];
  arrayGrupos: any = [];

  seleccion1: boolean = false;
  seleccion2: boolean = false;
  agregarGrupo: boolean = false;
  numeroMaes: number = 0;
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  id = this.authService.getIdFromToken();

  filterPost = '';
  grupo: Grupo = {
    nombre_grupo: '',
    categoria: '',
    Idioma: '',
    id_maestro: 0,
    id_maestro2: 0,
    fecha_inicio: '',
    fecha_revision: '',
    fecha_final: '',
  };
  clase: Clase = {
    id_grupo: 0,
    id_alumno: 0,
    fecha_inscripcion: '',
  };
  constructor(
    private claseService: ClasesService,
    private alumnosService: AlumnosService,
    private authService: AuthService,
    private maestrosService: MaestrosService,
    private gruposService: GruposService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const fechaOriginal: Date = new Date();
    if (fechaOriginal !== undefined) {
      const año: number = fechaOriginal.getFullYear();
      const mes: string = String(fechaOriginal.getMonth() + 1).padStart(2, '0');
      const día: string = String(fechaOriginal.getDate()).padStart(2, '0');
      const fechaFormateada: string = `${año}-${mes}-${día}`;
      console.log(fechaFormateada);
      this.clase.fecha_inscripcion = fechaFormateada;
    }

    this.maestrosService.getMaestros().subscribe(
      (res) => {
        this.arrayMaestros = res;
        console.log(res);
      },

      (err) => console.error(err)
    );

    this.alumnosService.getAlumnos().subscribe(
      (res) => {
        this.arrayAlumnos = res;
        console.log(res);
      },

      (err) => console.error(err)
    );

    this.gruposService.getGrupos().subscribe(
      (res) => {
        this.arrayGrupos = res;
        console.log(res);
      },

      (err) => console.error(err)
    );
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  agregarGrupos() {
    this.agregarGrupo = true;
  }

  guardarGrupo() {
    Swal.fire({
      title: 'Add this group?',
      text: 'this group will be added!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gruposService.saveGrupo(this.grupo).subscribe(
          (res) => {
            console.log(res);
            setTimeout(() => {
              location.reload();
            }, 2500);
            Swal.fire({
              title: 'Done!',
              text: 'New group has been added.',
              icon: 'success',
            });
          },

          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong! {err.message}',
              footer: '<a href="#">Why do I have this issue?</a>',
            });
          }
        );
      }
    });
  }

  numeroMaestro() {
    console.log(this.numeroMaes);

    if (this.seleccion2 == true) this.seleccion2 = false;

    if (this.numeroMaes == 1) {
      this.seleccion1 = true;
    }
    if (this.numeroMaes == 2) {
      this.seleccion1 = true;
      this.seleccion2 = true;
    }
  }

  escogerGrupo(id: number) {
    this.clase.id_grupo = id;
  }

  agregarClase(id: number) {
    this.clase.id_alumno = id;
    Swal.fire({
      title: 'Add this student?',
      text: 'This student will be add to this class!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.claseService.saveClase(this.clase).subscribe(
          (result) => {
            console.log(result);
            //this.router.navigate(['/horario']);
            Swal.fire({
              title: 'Done!',
              text: 'The student has been added.',
              icon: 'success',
            });
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
    });

    console.log('ID del alumno: ' + id);
  }

  nombreMaestro(id: number) {
    const maestro = this.arrayMaestros[0].find(
      (m: { id_user: number }) => m.id_user === id
    );
    return maestro
      ? `${maestro.first_nameU}` + `  ${maestro.last_nameU}`
      : 'Maestro no encontrado';
  }

  obtenerGrupo(idGrupo: number): any {
    // Verificar si el arreglo arrayGrupos[0] está definido
    if (this.arrayGrupos[0]) {
      const grupo = this.arrayGrupos[0].find(
        (m: { id_grupo: number }) => m.id_grupo === idGrupo
      );
      return grupo ? `${grupo.nombre_grupo}` : '';
    } else {
      return '';
    }
  }

  obtenerNombreMaestro(idGrupo: number): any {
    if (this.arrayGrupos[0]) {
      const grupo = this.arrayGrupos[0].find(
        (c: { id_grupo: number }) => c.id_grupo === idGrupo
      );
      if (grupo) {
        const maestro = this.arrayMaestros[0]?.find(
          (m: { id_user: number }) => m.id_user === grupo.id_maestro
        );
        return maestro
          ? `${maestro.first_nameU} ${maestro.last_nameU}`
          : 'Maestro no encontrado';
      }
    }
    return 'Maestro no encontrado';
  }

  obtenerNombreMaestro2(idGrupo: number): any {
    if (this.arrayGrupos[0]) {
      const grupo = this.arrayGrupos[0].find(
        (c: { id_grupo: number }) => c.id_grupo === idGrupo
      );
      if (grupo) {
        const maestro = this.arrayMaestros[0]?.find(
          (m: { id_user: number }) => m.id_user === grupo.id_maestro2
        );
        return maestro
          ? `${maestro.first_nameU} ${maestro.last_nameU}`
          : 'Maestro no encontrado';
      }
    }
    return 'Maestro no encontrado';
  }
}
