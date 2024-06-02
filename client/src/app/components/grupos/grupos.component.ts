import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GruposService } from 'src/app/services/grupos/grupos.service';
import { MaestrosService } from 'src/app/services/maestros/maestros.service';
import { Grupo } from 'src/app/models/grupos';
import { TagManagerService } from 'src/app/services/TagManager/tag-manager.service';
import { MaterialesServicesService } from 'src/app/services/materiales/materiales-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
})
export class GruposComponent implements OnInit {
  arrayGrupos: any = [];
  arrayMaestros: any = [];
  arrayCursos: any[] = [];
  arrayModulos: any[] = [];
  arraySubmodulos: any[] = [];
  edit: boolean = false;
  idG: any;
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  id = this.authService.getIdFromToken();

  grupo: Grupo = {
    nombre_grupo: '',
    categoria: '',
    idioma: 0,
    fecha_inicio: '',
    fecha_final: '',
    id_maestro: 0,
    id_maestro2: 0,
    modulo_idioma: 0,
    submodulo_idioma: 0,
  };
  constructor(
    private gruposService: GruposService,
    private maestrosService: MaestrosService,
    private authService: AuthService,
    private tagManagerService: TagManagerService,
    private materialService: MaterialesServicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gruposService.getGrupos().subscribe(
      (res) => {
        this.arrayGrupos = res;
        console.log(res);
      },

      (err) => console.error(err)
    );

    this.maestrosService.getMaestros().subscribe(
      (res) => {
        this.arrayMaestros = res;
        console.log(res);
      },
      (err) => console.error(err)
    );

    this.materialService.getCourseTags().subscribe(
      (res) => {
        this.arrayCursos = res;
      },
      (error) => {
        console.error('Error al obtener las etiquetas de curso:', error);
      }
    );

    this.tagManagerService.getModules().subscribe(
      (res) => {
        this.arrayModulos = res;
        console.log(res);
      },
      (err) => console.error(err)
    );

    this.tagManagerService.getSubmodules().subscribe(
      (res) => {
        this.arraySubmodulos = res;
        console.log(res);
      },
      (err) => console.error(err)
    );
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  obtenerGrupo(id: number) {
    const objeto: any = {};
    this.idG = id;

    this.gruposService.getGrupo(id.toString()).subscribe((res) => {
      this.edit = true;
      this.arrayGrupos = res;
      for (let i = 0; i < this.arrayGrupos[0].length; i++) {
        objeto[i] = this.arrayGrupos[0][i];
        this.grupo.fecha_inicio = objeto[i].fecha_inicio.substring(10, 0);
        this.grupo.fecha_final = objeto[i].fecha_final.substring(10, 0);
      }
      console.log(objeto);
      console.log(this.grupo.fecha_inicio);

      this.grupo = objeto[0];
      console.log(id);
    });
  }

  recargar() {
    location.reload();
  }

  actualizarGrupo() {
    this.gruposService.updateGrupo(this.idG, this.grupo).subscribe(
      (result) => {
        console.log(result);
        Swal.fire({
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Saved!', '', 'success');
            setTimeout(() => {
              location.reload();
            }, 2500);
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info');
          }
        });
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="#">Why do I have this issue?</a>',
        });
      }
    );
  }

  eliminarGrupo(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gruposService.deleteGrupo(id).subscribe(
          (res) => {
            Swal.fire('Eliminado!', 'El grupo ha sido eliminado.', 'success');
            this.recargar();
          },
          (err) => {
            if (err.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡No se puede eliminar el grupo porque tiene clases asociadas!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡Algo salió mal!',
              });
            }
          }
        );
      }
    });
  }

  obtenerNombreMaestro(idMaestro: number): string {
    if (this.arrayMaestros[0]) {
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
