import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.css'],
})
export class MaestrosComponent {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
