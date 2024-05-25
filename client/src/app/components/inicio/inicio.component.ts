import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  constructor(private authService: AuthService) {}

  isAdmin: boolean = false;
  isLogin: boolean = false;
  nombreUsuario: any;
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.isLogin = this.authService.isLogin();
    this.nombreUsuario = this.authService.getNameFromToken();
  }

  logout() {
    this.authService.removeToken();
    location.reload();
  }
}
