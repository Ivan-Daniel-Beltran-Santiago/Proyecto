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

  getUsers() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `asdasd`);
    console.log('Headers:', header);

    return this.http.get(`${this.API_URL}/user`, { headers: header });
  }

  getUser(id: string) {
    return this.http.get(`${this.API_URL}/user/${id}`);
  }

  saveUser(user: Users) {
    return this.http.post(`${this.API_URL}/user`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.API_URL}/user/${id}`);
  }

  updateUser(id: undefined | number, updatedUser: Users) {
    return this.http.put(`${this.API_URL}/user/${id}`, updatedUser);
  }
}
