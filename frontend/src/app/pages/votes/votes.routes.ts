import { Routes } from '@angular/router';

import { VoteComponent } from './vote/vote.component';
import { ResultsComponent } from './results/results.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

export const VotesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'votes',
        component: VoteComponent,
        canActivate: [AuthGuard], 
        data: {
          title: 'Votos',
        },
      }
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'results',
        component: ResultsComponent,
        data: {
          title: 'Resultados',
        },
      }
    ],
  },
];
