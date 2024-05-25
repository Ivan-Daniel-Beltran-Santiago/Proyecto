import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Calificacion } from '../../models/calificaciones';
@Injectable({
  providedIn: 'root',
})
export class CalificacionesService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getCalificaciones(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/calificacion/${id}`, {
      headers: header,
    });
  }

  getAllCalificaciones() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/calificacion`, { headers: header });
  }

  getCalificacion(idG: string, id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/calificacion/${idG}/${id}`, {
      headers: header,
    });
  }

  getCalificacionFecha(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/calificacion/${id}`, {
      headers: header,
    });
  }

  saveCalificacion(calificacion: Calificacion) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/calificacion`, calificacion, {
      headers: header,
    });
  }

  deleteCalificacion(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.delete(`${this.API_URL}/calificacion/${id}`, {
      headers: header,
    });
  }

  updateCalificacion(
    id: undefined | number,
    updatedCalificacion: Calificacion
  ) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.API_URL}/calificacion/${id}`,
      updatedCalificacion,
      { headers: header }
    );
  }
}
