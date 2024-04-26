import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}
  private tokenKey = 'token';

  isLogin(): boolean {
    const token = localStorage.getItem('token');
    if (token === undefined || token == null) {
      return false;
    } else {
      return true;
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token === undefined || token === null) {
      this.router.navigate(['/login']);
      return null;
    } else {
      return token;
    }
  }

  getNameFromToken(): string | null {
    let token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        return decoded.nombre; // Ajusta esto según la estructura de tu token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getRoleFromToken(): string | null | number {
    //const token = localStorage.getItem('token');
    let token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        return decoded.rol; // Ajusta esto según la estructura de tu token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getIdFromToken(): string | null | number {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log(decoded.id);
        return decoded.id; // Ajusta esto según la estructura de tu token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAdmin(): boolean {
    const role = this.getRoleFromToken();
    return role !== null && role === 3;
  }

  isMaestro(): boolean {
    const role = this.getRoleFromToken();
    return role !== null && role === 2;
  }
  
  isAlumno(): boolean {
    const role = this.getRoleFromToken();
    return role !== null && role === 1;
  }
}
