import { Component, OnInit } from '@angular/core';
import { VoteDTO } from '../../../models/vote.dto';
import { VoteFactory, VotingStrategy } from '../../../factories/vote-factory';
import { VoteService } from 'src/app/services/vote.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports:[
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
  options: string[] = [];
  selectedOption: string = '';
  userId = '22'; // Genera un UUID para cada usuario
  votingStrategy!: VotingStrategy;
  contacts: any;
  candidatos = [
    {
      id: '1',
      fullName: 'Juan Pérez',
      party: 'Partido Azul',
      listNumber: 10,
      age: 45,
      experience: 'Diputado desde 2015',
      description: 'Defiende la educación gratuita',
      photoUrl: '/assets/images/profile/user5.jpg',
      contactimg: 'https://example.com/juan.jpg',
      contactname: 'Juan Pérez',
      contactpost: 'Candidato Partido Azul',
      contactadd: 'Calle 123, Ciudad',
      contactno: '+123456789',
      contactinstagram: '@juanperez',
      contactlinkedin: 'linkedin.com/in/juanperez',
      contactfacebook: 'facebook.com/juanperez',
    },
    {
      id: '2',
      fullName: 'María Gómez',
      party: 'Partido Verde',
      listNumber: 15,
      age: 50,
      experience: 'Senadora',
      description: 'Promueve energías renovables',
      photoUrl: 'https://example.com/maria.jpg',
      contactimg: 'https://example.com/maria.jpg',
      contactname: 'María Gómez',
      contactpost: 'Candidata Partido Verde',
      contactadd: 'Avenida Central, Ciudad',
      contactno: '+987654321',
      contactinstagram: '@mariagomez',
      contactlinkedin: 'linkedin.com/in/mariagomez',
      contactfacebook: 'facebook.com/mariagomez',
    },
    {
      id: '3',
      fullName: 'Carlos Ruiz',
      party: 'Partido Rojo',
      listNumber: 20,
      age: 40,
      experience: 'Alcalde actual',
      description: 'Impulsa el transporte público',
      photoUrl: 'https://example.com/carlos.jpg',
      contactimg: 'https://example.com/carlos.jpg',
      contactname: 'Carlos Ruiz',
      contactpost: 'Candidato Partido Rojo',
      contactadd: 'Barrio Norte, Ciudad',
      contactno: '+1122334455',
      contactinstagram: '@carlosruiz',
      contactlinkedin: 'linkedin.com/in/carlosruiz',
      contactfacebook: 'facebook.com/carlosruiz',
    }
  ];
  
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
      console.log("cote",vote)
      this.voteService.submitVote(vote).subscribe({
          next: () => alert('Voto registrado con éxito.'),
          error: (err) => {
            console.error('Error al registrar el voto:', err);
          },
      });
  }
}
