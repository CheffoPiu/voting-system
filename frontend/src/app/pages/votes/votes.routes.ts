import { Routes } from '@angular/router';

import { VoteComponent } from './vote/vote.component';
import { ResultsComponent } from './results/results.component';

export const VotesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'votes',
        component: VoteComponent,
      }
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'results',
        component: ResultsComponent,
      }
    ],
  },
];
