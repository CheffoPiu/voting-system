import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VoteDTO } from '../models/vote.dto';

@Injectable({
    providedIn: 'root',
})
export class VoteService {
    private backendUrl = 'http://192.168.100.53:3000/vote'; // URL del backend
    private resultsUrl = 'http://192.168.100.53:3000/results'; // Nueva URL para obtener resultados
    private logsUrl = 'http://192.168.100.53:3000/admin/vote-logs-detailed';

    constructor(private http: HttpClient) {}

    
    // Método para enviar un voto
    submitVote(vote: VoteDTO): Observable<any> {
        return this.http.post(this.backendUrl, vote);
    }

    /** 🔹 Método para obtener resultados */
    getResults(): Observable<any> {
        return this.http.get<any>(this.resultsUrl);
    }
    
     /** 🔹 Obtener logs de votación detallados */
     getVoteLogs(): Observable<any> {
        return this.http.get<any>(this.logsUrl);
    }

}
