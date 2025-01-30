import { Routes } from '@angular/router';

import { CandidatosComponent } from './candidatos/candidatos.component';
import { UsersComponent } from './users/users.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'candidatos',
        component: CandidatosComponent,
      }
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UsersComponent,
      }
    ],
  },
];
