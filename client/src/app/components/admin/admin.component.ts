import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  constructor(private authService: AuthService, private router: Router) {}
  public nombreUsuario: any = '';

  ngOnInit() {
    this.nombreUsuario = this.authService.getNameFromToken();
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
