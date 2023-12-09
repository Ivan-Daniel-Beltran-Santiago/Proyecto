import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from 'src/app/models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {

   }

   //OBTENER TODOS LOS MAESTROS
   getAdmins() {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.get(`${this.API_URL}/admin`,{ headers:header });
   }

   //OBTENER UN MAESTROS

   getAdmin(id : string) {
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.API_URL}/admin/${id}`,{ headers:header });
   }

   //GUARDAR MAESTROS

   saveAdmin(user:Admin){
    const token = localStorage.getItem('token');

    const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.post(`${this.API_URL}/admin`,user,{ headers:header });
   }

   //BORRAR MAESTROS 

    deleteAdmin(id : string) {
      const token = localStorage.getItem('token');

      const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.delete(`${this.API_URL}/admin/${id}`,{ headers:header });
    }

    //ACTUALIZAR MAESTROS

    updateAdmin(id : string , updatedUser:Admin){
      const token = localStorage.getItem('token');

      const header = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.put(`${this.API_URL}/admin/${id}`,updatedUser,{ headers:header });
    }
}
