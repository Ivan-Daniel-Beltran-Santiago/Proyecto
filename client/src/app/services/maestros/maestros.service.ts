import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Maestro } from 'src/app/models/maestros';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getMaestros() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);

    return this.http.get(`${this.API_URL}/maestro`, { headers: header });
  }

  getMaestro(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);

    return this.http.get(`${this.API_URL}/maestro/${id}`, { headers: header });
  }

  saveMaestro(user: Maestro) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/maestro`, user, { headers: header });
  }

  deleteMaestro(id: number) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.delete(`${this.API_URL}/maestro/${id}`, {
      headers: header,
    });
  }

  updateMaestro(id: string, updatedUser: Maestro) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(`${this.API_URL}/maestro/${id}`, updatedUser, {
      headers: header,
    });
  }
}
