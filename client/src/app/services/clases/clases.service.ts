import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Clase } from '../../models/clases';

@Injectable({
  providedIn: 'root',
})
export class ClasesService {
  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getClases() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/clase`, { headers: header });
  }

  getClase(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/clase/${id}`, { headers: header });
  }

  saveClase(clase: Clase) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/clase`, clase, { headers: header });
  }

  deleteClase(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.delete(`${this.API_URL}/clase/${id}`, { headers: header });
  }

  updateClase(id: undefined | number, updatedClase: Clase) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.put(`${this.API_URL}/clase/${id}`, updatedClase, {
      headers: header,
    });
  }
}
