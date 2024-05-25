import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alumno } from 'src/app/models/alumnos';
@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getAlumnos() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);

    return this.http.get(`${this.API_URL}/alumno`, { headers: header });
  }

  getAlumno(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/alumno/${id}`, { headers: header });
  }

  saveAlumno(user: Alumno) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/alumno`, user, { headers: header });
  }

  deleteAlumno(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.delete(`${this.API_URL}/alumno/${id}`, {
      headers: header,
    });
  }

  updateAlumno(id: string, updatedUser: Alumno) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(`${this.API_URL}/alumno/${id}`, updatedUser, {
      headers: header,
    });
  }
}
