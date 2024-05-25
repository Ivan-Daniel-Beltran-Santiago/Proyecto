import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MaestrosService } from 'src/app/services/maestros/maestros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maestros-list',
  templateUrl: './maestros-list.component.html',
  styleUrls: ['./maestros-list.component.css'],
})
export class MaestrosListComponent {
  arrayMaestros: any = [];
  filterPost = '';
  constructor(
    private maestrosService: MaestrosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMaestro();
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  getMaestro() {
    this.maestrosService.getMaestros().subscribe(
      (res) => {
        this.arrayMaestros = res;
        console.log(this.arrayMaestros[0]);
      },

      (err) => console.error(err)
    );
  }

  deleteMaestro(id_maestro: number) {
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
        this.maestrosService.deleteMaestro(id_maestro).subscribe(
          (res) => console.log(res),
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: '<a href="#">Why do I have this issue?</a>',
            });
          }
        );
        this.getMaestro();
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  }
}
