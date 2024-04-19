import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GrabacionesService } from 'src/app/services/grabaciones/grabaciones.service';
import { ClasesHorariosService } from 'src/app/services/clasesHorarios/clases-horarios.service';
import { MaestrosService } from 'src/app/services/maestros/maestros.service';
import { AlumnoGruposService } from 'src/app/services/alumnoGrupos/alumno-grupos.service';
import { Grabacion } from 'src/app/models/grabaciones';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grabaciones',
  templateUrl: './grabaciones.component.html',
  styleUrls: ['./grabaciones.component.css'],
})
export class GrabacionesComponent {
  isAdmin: boolean = false;
  arrayGrabaciones: any = [];

  arrayClases: any = [];
  arrayMaestros: any = [];
  rol = this.authService.getRoleFromToken();
  id: any = this.authService.getIdFromToken();
  isAlumno: boolean = false;
  isMaestro = this.authService.isMaestro();
  mostrarGrab: boolean = false;
  obtenerGrab: boolean = false;
  agregarGrab: boolean = false;
  grabacion: Grabacion = {
    titulo: '',
    URL: '',
    fecha: '',
    id_clase: 0,
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private grabacionesService: GrabacionesService,
    private clasesHorarioService: ClasesHorariosService,
    private maestrosService: MaestrosService,
    private alumnosGrupoService: AlumnoGruposService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();

    this.obtenerGrabaciones();
    this.obtenerClases();
    this.getMaestros();

    const params = this.activatedRoute.snapshot.params;
    if (params['id'] && params['id2']) {
      this.obtenerGrab = true;
      this.grabacionesService
        .getGrabacionFecha(params['id'], params['id2'])
        .subscribe((res) => {
          this.arrayGrabaciones = res;

          console.log(this.arrayGrabaciones[0]);
        });
    }
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  obtenerGrabaciones() {
    this.grabacionesService.getGrabaciones().subscribe(
      (res) => {
        this.arrayGrabaciones = res;
        console.log(this.arrayGrabaciones[0]);
      },
      (err) => console.error(err)
    );
  }

  guardarGrabaciones() {
    Swal.fire({
      title: 'Save this recording?',
      text: 'this recording will be added!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.grabacionesService.saveGrabacion(this.grabacion).subscribe(
          (res) => {
            console.log(res);
            setTimeout(() => {
              location.reload();
            }, 2500);
            Swal.fire({
              title: 'Done!',
              text: 'New recording has been saved.',
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
  }

  obtenerClases() {
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

  getGrabaciones(id: number) {
    this.obtenerGrab = false;
    console.log(id);
    this.mostrarGrab = true;
    this.grabacionesService.getGrabacion(id.toString()).subscribe(
      (res) => {
        this.arrayGrabaciones = res;
        console.log(this.arrayGrabaciones[0]);
      },

      (err) => console.error(err)
    );
  }

  escogerClase(id: number) {
    this.grabacion.id_clase = id;
  }

  agregarNuevaG() {
    this.agregarGrab = true;
  }

  getMaestros() {
    this.maestrosService.getMaestros().subscribe(
      (res) => {
        this.arrayMaestros = res;
        console.log(this.arrayMaestros[0]);
      },

      (err) => console.error(err)
    );
  }

  obtenerNombreMaestro(idMaestro: number): string {
    if (this.arrayMaestros[0]) {
      const maestro = this.arrayMaestros[0].find(
        (m: { id_user: number }) => m.id_user === idMaestro
      );
      return maestro ? `${maestro.first_nameU} ${maestro.last_nameU}` : 'Maestro no encontrado';
    } else {
      return 'Array de maestros no definido';
    }
  }  

  obtenerNombreMaestro2(idMaestro: number): string {
    if (this.arrayMaestros && this.arrayMaestros.length > 0) {
      const maestro = this.arrayMaestros[0].find(
        (m: { id_user: number }) => m.id_user === idMaestro
      );
      return maestro
        ? `${maestro.first_nameU} ${maestro.last_nameU}`
        : 'Maestro no encontrado';
    } else {
      return 'Array de maestros no definido';
    }
  }
  
  obtenerNombreGrupo(idClase: number): string {
    // Encuentra la clase correspondiente al id_grupo
    //const clase = this.arrayClases[0].find((c: {id_grupo:number})=> c.id_grupo === idGrupo);

    // Si se encuentra la clase, encuentra el maestro correspondiente al id_maestro

    const grupo = this.arrayClases[0].find(
      (m: { id_clase: number }) => m.id_clase === idClase
    );
    return grupo ? `${grupo.nombre_grupo} ` : 'Grupo no encontrado';
  }

  obtenerIdNombreGrupo(idClase: number): string {
    // Encuentra la clase correspondiente al id_grupo
    //const clase = this.arrayClases[0].find((c: {id_grupo:number})=> c.id_grupo === idGrupo);

    // Si se encuentra la clase, encuentra el maestro correspondiente al id_maestro

    const grupo = this.arrayClases[0].find(
      (m: { id_clase: number }) => m.id_clase === idClase
    );
    return grupo
      ? `ID: ${grupo.id_grupo}---Name--${grupo.nombre_grupo} `
      : 'Ninguna clase seleccionada';
  }

  eliminarGrabacion(id_grabacion: string) {
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
        this.grabacionesService.deleteGrabacion(id_grabacion).subscribe(
          (res) => {
            console.log(res);
            location.reload();
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        );
        Swal.fire({
          title: 'Deleted!',

          text: 'The recording has been deleted.',
          icon: 'success',
        });
      }
    });
  }
}
