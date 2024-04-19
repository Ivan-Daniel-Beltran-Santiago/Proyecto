import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagManagerService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  postTag(tagData: any): Observable<any> {
    console.log('Data de etiqueta:', tagData); // Agregado para depurar
    return this.http.post(`${this.API_URL}/tags`, tagData);
  }

  checkTagExists(tagName: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.API_URL}/tags/check/${tagName}`
    );
  }

  getParentTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/tags/parent`);
  }

  getTagIdByName(tagName: string, type: string): Observable<number | null> {
    return this.http.get<number | null>(`${this.API_URL}/tags/course/${tagName}`, { params: { type } });
  }  

  getModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/tags/modules`);
  }  

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/tags`);
  }  

  deleteTag(tagName: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/tags/${tagName}`);
  }  

  getCourses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/tags/courses`);
  }  

  updateTagName(oldName: string, newName: string): Observable<any> {
    return this.http.put(`${this.API_URL}/tags/${oldName}`, { newName });
  }  

  updateTagTypeAndParentId(tagName: string, type: string, parentId: number | null): Observable<any> {
    return this.http.put(`${this.API_URL}/tags/type-parent/${tagName}`, { type, parentId });
  }  

  assignTags(tagData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/assign-tags`, tagData);
  }
}
