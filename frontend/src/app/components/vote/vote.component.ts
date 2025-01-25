import { Component, OnInit } from '@angular/core';
import { VoteDTO } from '../../models/vote.dto';
import { VoteFactory, VotingStrategy } from '../../factories/vote-factory';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})

export class VoteComponent implements OnInit {
  options: string[] = [];
  selectedOption: string = '';
  userId = '123e4567-e89b-12d3-a456-426614174000'; // Genera un UUID para cada usuario
  votingStrategy!: VotingStrategy;

  constructor(private voteService: VoteService) {}

  ngOnInit(): void {
      // Cambia el tipo de votación según el contexto
      this.votingStrategy = VoteFactory.createVoting('political');
      this.options = this.votingStrategy.getOptions();
  }

  submitVote(): void {
      if (!this.selectedOption) {
          alert('Selecciona una opción antes de votar.');
          return;
      }

      const vote = new VoteDTO(this.userId, this.selectedOption);
      this.voteService.submitVote(vote).subscribe({
          next: () => alert('Voto registrado con éxito.'),
          error: () => alert('Hubo un error al registrar tu voto.'),
      });
  }
}
