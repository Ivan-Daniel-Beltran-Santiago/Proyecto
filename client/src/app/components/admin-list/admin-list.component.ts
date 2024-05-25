import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
})
export class AdminListComponent implements OnInit {
  arrayAdmin: any = [];
  filterPost = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAdmin();
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  getAdmin() {
    this.adminService.getAdmins().subscribe(
      (res) => {
        this.arrayAdmin = res;
        console.log(this.arrayAdmin[0]);
      },
      (err) => console.log(err)
    );
  }

  deleteAdmin(id_admin: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(id_admin).subscribe(
          (res) => {
            console.log(res);
            this.getAdmin();
          },
          (err) => {
            console.error(err);
          }
        );
        Swal.fire('Eliminado', 'El elemento ha sido eliminado.', 'success');
      }
    });
  }
}
