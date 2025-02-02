import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Verifica si hay token en localStorage
    if (!token) {
      this.router.navigate(['/authentication/login']); // Si no hay token, redirige a login
      return false;
    }
    return true;
  }
}
