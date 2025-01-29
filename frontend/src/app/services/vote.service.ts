import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VoteDTO } from '../models/vote.dto';

@Injectable({
    providedIn: 'root',
})
export class VoteService {
    private backendUrl = 'http://localhost:3000'; // URL del backend

    constructor(private http: HttpClient) {}

    // Método para enviar un voto
    submitVote(vote: VoteDTO): Observable<any> {
        return this.http.post(`${this.backendUrl}/vote`, vote, { responseType: 'text' });
    }

    // Método para obtener resultados
    getResults(): Observable<any> {
        return this.http.get(`${this.backendUrl}/results`);
    }
}
