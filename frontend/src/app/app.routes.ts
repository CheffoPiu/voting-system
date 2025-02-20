import { Routes, RouterModule } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboards/dashboard1',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then(
            (m) => m.AdminRoutes
          ),
          canActivate: [AuthGuard , RoleGuard], // 🔒 Protegida con AuthGuard
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/votes/votes.routes').then(
            (m) => m.VotesRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/login',
  },
];

export const AppRoutes = RouterModule.forRoot(routes, { useHash: true }); // ✅ Agregado { useHash: true }
