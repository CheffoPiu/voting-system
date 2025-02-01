import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateDTO } from '../models/candidato.dto';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {
  private apiUrl = 'http://localhost:3000/admin/candidates'; // URL del backend

  constructor(private http: HttpClient) {}

  /** 🔹 Listar todos los candidatos **/
  listCandidatos(): Observable<CandidateDTO[]> {
    return this.http.get<CandidateDTO[]>(this.apiUrl);
  }

  /** 🔹 Crear un candidato **/
  createCandidato(candidate: CandidateDTO): Observable<CandidateDTO> {
    return this.http.post<CandidateDTO>(this.apiUrl, candidate);
  }

  /** 🔹 Editar un candidato **/
  editCandidato(candidate: CandidateDTO): Observable<CandidateDTO> {
    return this.http.put<CandidateDTO>(`${this.apiUrl}/${candidate.id}`, candidate);
  }

  /** 🔹 Eliminar un candidato **/
  deleteCandidato(candidateId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${candidateId}`);
  }
}
