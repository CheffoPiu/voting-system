import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { UserService } from 'src/app/services/user.service'; // ✅ Importa el servicio de usuarios
import { ToastrService } from 'ngx-toastr'; // ✅ Importa Toastr para notificaciones
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private userService: UserService, // ✅ Inyecta el servicio de autenticación
    private router: Router,
    private toastr: ToastrService // ✅ Inyecta Toastr
  ) { }

  form = new FormGroup({
    cedula: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    const credentials = {
      cedula: this.form.value.cedula || '', // Asegura que siempre sea string
      password: this.form.value.password || '',
    };

    console.log("credentials",credentials)
    this.userService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.toastr.success('Inicio de sesión exitoso', 'Éxito');

        if (response.user.rol === 'USER') {
          this.router.navigate(['/users/votes']);
        } else {
          this.router.navigate(['/admin/users']);
        }
      },
      error: () => {
        this.toastr.error('Credenciales incorrectas', 'Error');
      }
    });
  }
}
