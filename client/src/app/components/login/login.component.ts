import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users/users.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLogin = this.authService.isLogin();
  isAdmin = this.authService.isAdmin();

  constructor(
    private userService: UsersService,
    private router: Router,
    private authService: AuthService
  ) {}

  loginUsuario() {
    if (this.email == '' || this.password == '') {
      console.log('Please enter');
    } else {
    }

    const user: Users = {
      id_user: 0,
      first_nameU: '',
      last_nameU: '',
      last_nameU2: '',
      telephoneU: '',
      email: this.email,
      password: this.password,
      id_rol: 0,
    };
    this.userService.loginUser(user).subscribe({
      next: (token: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Signed in successfully',
        });

        localStorage.setItem('token', token.toString());
        let rol = this.authService.getRoleFromToken();
        if (rol == 3) this.router.navigate(['/usuarios-list']);
        if (rol == 2) this.router.navigate(['/horarios']);
        if (rol == 1) this.router.navigate(['/grabaciones']);
      },
      error: (error: any) => {
        let errorMessage = 'An error occurred while logging in';
        if (error && error.err && error.err.msg) {
          errorMessage = error.err.msg;
        }
        Swal.fire({
          icon: 'error',
          title: 'Oops... login error',
          text: errorMessage,
        });
      },
    });
  }
}
