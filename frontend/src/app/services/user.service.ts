import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../models/user.dto'; // Asegúrate de importar tu modelo

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://192.168.100.53:3000/admin/users'; // URL del backend
  private authUrl = 'http://192.168.100.53:3000/auth'; // ✅ Autenticación

  constructor(private http: HttpClient) {}

  /** 🔹 Listar todos los usuarios **/
  listUsuarios(): Observable<UserDTO[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 🔹 Crear un usuario **/
  createUsuario(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  /** 🔹 Editar un usuario **/
  editUsuario(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }

  /** 🔹 Eliminar un usuario **/
  deleteUsuario(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  /** 🔹 Login de usuario **/
  login(credentials: { cedula: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials);
  }
  
}
