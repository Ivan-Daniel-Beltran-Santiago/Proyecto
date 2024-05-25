import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css'],
})
export class AlumnosComponent {
  constructor(private authService: AuthService) {}

  nombreUsuario = this.authService.getNameFromToken();
}
