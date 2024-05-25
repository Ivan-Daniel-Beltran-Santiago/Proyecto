import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Grupo } from 'src/app/models/grupos';

@Injectable({
  providedIn: 'root',
})
export class ClasesHorariosService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getClasesHorarios() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/claseHorario`, { headers: header });
  }

  getClaseHorario(id: string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/claseHorario/${id}`, {
      headers: header,
    });
  }

  postNuevoGrupoCopiado(id: string, grupo: Grupo) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/claseHorario/${id}`, grupo, {
      headers: header,
    });
  }
}
