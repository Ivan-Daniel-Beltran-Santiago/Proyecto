import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../models/users';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

export class UsersService {
  API_URL = 'http://localhost:3000';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private httpHeaders: HttpHeaders
  ) {}

  //OBTENER TODOS LOS USUARIOS
  getUsers() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `asdasd`);
    console.log('Headers:', header);

    return this.http.get(`${this.API_URL}/user`, { headers: header });
  }

  //OBTENER UN USUARIO

  getUser(id: string) {
    return this.http.get(`${this.API_URL}/user/${id}`);
  }

  //GUARDAR USUARIO

  saveUser(user: Users) {
    return this.http.post(`${this.API_URL}/user`, user);
  }

  //BORRAR USUARIO

  deleteUser(id: string) {
    return this.http.delete(`${this.API_URL}/user/${id}`);
  }

  //ACTUALIZAR USUARIO

  updateUser(id: undefined | number, updatedUser: Users) {
    return this.http.put(`${this.API_URL}/user/${id}`, updatedUser);
  }
}
