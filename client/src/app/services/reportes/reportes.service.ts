import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getAlumno_Maestros() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);

    return this.http.get(`${this.API_URL}/reporte/alumnoMaestro`, {
      headers: header,
    });
  }

  getAlumno_Grupos() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);

    return this.http.get(`${this.API_URL}/reporte/alumnoGrupo`, {
      headers: header,
    });
  }

  getHoras_Maestro() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);

    return this.http.get(`${this.API_URL}/reporte/horaMaestro`, {
      headers: header,
    });
  }
}
