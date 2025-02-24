import { Routes } from '@angular/router';

import { CandidatosComponent } from './candidatos/candidatos.component';
import { UsersComponent } from './users/users.component';
import { LogsComponent } from './logs/logs.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'candidatos',
        component: CandidatosComponent,
        data: {
          title: 'Candidatos',
        },
      }
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Usuarios',
        },
      }
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'logs',
        component: LogsComponent,
        data: {
          title: 'Logs',
        },
      }
    ],
  },
];
