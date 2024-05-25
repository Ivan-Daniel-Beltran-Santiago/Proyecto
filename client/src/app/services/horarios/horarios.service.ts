import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Horario } from 'src/app/models/horarios';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getHorarios() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/horario`, { headers: header });
  }

  getHorario(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/horario/${id}`, { headers: header });
  }

  getHorarioMaestro(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/horarioMaestro/${id}`, {
      headers: header,
    });
  }

  saveHorario(horario: Horario) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/horario`, horario, {
      headers: header,
    });
  }

  deleteHorario(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.delete(`${this.API_URL}/horario/${id}`, {
      headers: header,
    });
  }

  updateHorario(id: number | undefined, updatedHorario: Horario) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(`${this.API_URL}/horario/${id}`, updatedHorario, {
      headers: header,
    });
  }
}
