import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlumnoGruposService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAlumnos(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/alumnoGrupo/${id}`, {
      headers: header,
    });
  }

  getAlumnosBaja() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/alumnoGrupo`, {
      headers: header,
    });
  }

  getClases(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/alumnoGrupo/s/${id}`, {
      headers: header,
    });
  }

  deleteAlumnoClase(id: string, idG: string, fecha: string | undefined) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(`${this.API_URL}/alumnoGrupo/${id}/${idG}/${fecha}`, {
      headers: header,
    });
  }

  reinscribirAlumnoClase(
    fecha: string | undefined,
    idAlumno: string,
    idGrupo: string
  ) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.API_URL}/alumnoGrupo/s/${fecha}/${idAlumno}/${idGrupo}`,
      {
        headers: header,
      }
    );
  }
}
