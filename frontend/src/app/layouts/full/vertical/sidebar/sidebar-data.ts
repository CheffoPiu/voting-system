import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'ADMIN',
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    bgcolor: 'primary',
    route: '/admin/users',
  },
  {
    displayName: 'Candidatos',
    iconName: 'flag',
    bgcolor: 'primary',
    route: '/admin/candidatos',
  },
  {
    displayName: 'Logs',
    iconName: 'logs',
    bgcolor: 'primary',
    route: '/admin/logs',
  },
  {
    displayName: 'Resultados',
    iconName: 'report-analytics',
    bgcolor: 'primary',
    route: '/users/results',
  },
];
