import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidatoDTO } from '../models/candidato.dto';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {
  private apiUrl = 'http://localhost:3000/admin/candidatos'; // URL del backend

  constructor(private http: HttpClient) {}

  /** 🔹 Listar todos los candidatos **/
  listCandidatos(): Observable<CandidatoDTO[]> {
    return this.http.get<CandidatoDTO[]>(this.apiUrl);
  }

  /** 🔹 Crear un candidato **/
  createCandidato(candidate: CandidatoDTO): Observable<CandidatoDTO> {
    return this.http.post<CandidatoDTO>(this.apiUrl, candidate);
  }

  /** 🔹 Editar un candidato **/
  editCandidato(candidate: CandidatoDTO): Observable<CandidatoDTO> {
    return this.http.put<CandidatoDTO>(`${this.apiUrl}/${candidate.id}`, candidate);
  }

  /** 🔹 Eliminar un candidato **/
  deleteCandidato(candidateId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${candidateId}`);
  }
}
