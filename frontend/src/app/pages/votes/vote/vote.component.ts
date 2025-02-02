import { Component, OnInit } from '@angular/core';
import { VoteDTO } from '../../../models/vote.dto';
import { VoteFactory, VotingStrategy } from '../../../factories/vote-factory';
import { VoteService } from 'src/app/services/vote.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CandidatoService } from 'src/app/services/candidato.service';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  selectedOption: string = '';
  userId: any
  candidatos: any[] = []; // Se llenará con datos del backend

  constructor(private voteService: VoteService,
    private candidatoService: CandidatoService
  ) {}

  ngOnInit(): void {
    this.loadUser(); // ✅ Obtener ID del usuario
    this.loadCandidatos(); // ✅ Cargar candidatos desde el backend
  }

  loadCandidatos(): void {
    this.candidatoService.listCandidatos().subscribe({
      next: (data) => {
        console.log('✅ Candidatos obtenidos:', data);
        this.candidatos = data;
      },
      error: (error) => {
        console.error('❌ Error al obtener candidatos:', error);
      },
    });
  }

  loadUser(): void {
    const storedUser = localStorage.getItem('user'); // Obtener el JSON del usuario
  
    if (!storedUser) {
      console.error('❌ No se encontró la información del usuario. Redirigiendo...');
      alert('Debes iniciar sesión para votar.');
      window.location.href = '/auth/login'; // Redirigir a login
      return;
    }
  
    try {
      const user = JSON.parse(storedUser); // Convertir JSON a objeto
      this.userId = user.id.toString(); // Obtener el ID y convertirlo a string
  
      console.log("✅ ID de usuario obtenido:", this.userId);
    } catch (error) {
      console.error('❌ Error al parsear el usuario:', error);
      alert('Error al obtener datos del usuario.');
      window.location.href = '/auth/login';
    }
  }
  


  submitVote(): void {
    if (!this.selectedOption) {
      alert('Selecciona una opción antes de votar.');
      return;
    }

    const vote = new VoteDTO(this.userId, this.selectedOption);
    console.log("Enviando voto:", vote);
    
    this.voteService.submitVote(vote).subscribe({
      next: () => alert('✅ Voto registrado con éxito.'),
      error: (err) => {
        console.error('❌ Error al registrar el voto C:', err);
      },
    });
  }
  
}
