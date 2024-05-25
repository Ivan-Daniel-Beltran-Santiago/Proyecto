import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  rol = this.authService.getRoleFromToken();
  id: any = this.authService.getIdFromToken();
  isAdmin: boolean;
  isMaestro: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.isAdmin = this.authService.isAdmin();
    this.isMaestro = this.authService.isMaestro();
  }

  nombreUsuario = this.authService.getNameFromToken();

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
