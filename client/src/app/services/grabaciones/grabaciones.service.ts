import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grabacion } from 'src/app/models/grabaciones';

@Injectable({
  providedIn: 'root',
})
export class GrabacionesService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getGrabaciones() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/grabacion`, { headers: header });
  }

  getGrabacion(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/grabacion/${id}`, {
      headers: header,
    });
  }

  getGrabacionFecha(id: string, fecha: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/grabacion/${id}/${fecha}`, {
      headers: header,
    });
  }

  saveGrabacion(grabacion: Grabacion) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/grabacion`, grabacion, {
      headers: header,
    });
  }

  deleteGrabacion(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.delete(`${this.API_URL}/grabacion/${id}`, {
      headers: header,
    });
  }

  updateGrabacion(id: undefined | number, grabacion: Grabacion) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(`${this.API_URL}/grabacion/${id}`, grabacion, {
      headers: header,
    });
  }
}
