import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from '../../../models/user.dto'; // ✅ Importa el DTO

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MaterialModule,
    TablerIconsModule,
    CommonModule
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent implements OnInit {
  dataSource = new MatTableDataSource<UserDTO>([]);
  displayedColumns: string[] = ['index', 'nombre', 'apellido', 'cedula', 'email', 'rol' , 'acciones'];

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private userService: UserService // ✅ Inyectamos el servicio aquí
  ) {}


  ngOnInit(): void {
    console.log("entra aqui")
    this.loadUsuarios();
  }

  async loadUsuarios() {

   this.userService.listUsuarios().subscribe({
    next: (usuarios) => {
      console.log('Usuarios obtenidos:', usuarios);
      this.dataSource.data = usuarios;
    },
    error: (error) => {
      console.error('❌ Error al obtener usuarios:', error);
    },
    complete: () => {
      console.log('✅ Petición de usuarios completada.');
    }
  });

  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, user: any): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      width: '600px',
      data: { action: action, data: user  },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("resukt",result)
      if (result?.event === 'Agregar') {
        console.log('Usuario guardado:', result.data);
        this.saveUser(result.data);
      }else if(result?.event === 'Edit'){
        this.editUser(result.data);
      }else if(result?.event === 'Delete'){
        this.deleteUser(result.data.id);
      }
    });
  }


   /** Crear un nuevo usuario **/
  async saveUser(user: any) {
    try {
      console.log('Guardando usuario:', user);

      this.userService.createUsuario(user).subscribe({
        next: (response) => {
          console.log('✅ Usuario creado:', response);
          this.toastr.success('Usuario creado correctamente', 'Éxito');
          this.loadUsuarios(); // Recargar la lista de usuarios
        },
        error: (error) => {
          this.toastr.error('Error al crear el usuario', 'Error');
          console.error('❌ Error al crear usuario:', error);
        },
        complete: () => {
          console.log('✅ Creación de usuario completada.');
        }
      });

    } catch (error) {
      console.error('❌ Error en la creación del usuario:', error);
      this.toastr.error('Error al crear el usuario', 'Error');
    }
  }


  /** Editar un usuario existente **/
  async editUser(user: any) {
    try {
      console.log('Editando usuario:', user);

      this.userService.editUsuario(user).subscribe({
        next: (response) => {
          console.log('✅ Usuario actualizado:', response);
          this.toastr.success('Usuario actualizado correctamente', 'Éxito');
          this.loadUsuarios(); // Recargar la lista de usuarios
        },
        error: (error) => {
          this.toastr.error('Error al actualizar el usuario', 'Error');
          console.error('❌ Error al actualizar usuario:', error);
        },
        complete: () => {
          console.log('✅ Edición de usuario completada.');
        }
      });
    } catch (error) {
      console.error('❌ Error en la edición del usuario:', error);
      this.toastr.error('Error al actualizar el usuario', 'Error');
    }
  }


  /** Eliminar un usuario **/
  async deleteUser(userId: number) {
    try {
      console.log('🗑️ Eliminando usuario con ID:', userId);

      this.userService.deleteUsuario(userId).subscribe({
        next: (response) => {
          console.log('✅ Usuario eliminado:', response);
          this.toastr.success('Usuario eliminado correctamente', 'Éxito');
          this.loadUsuarios(); // Recargar la lista de usuarios
        },
        error: (error) => {
          this.toastr.error('Error al eliminar el usuario', 'Error');
          console.error('❌ Error al eliminar usuario:', error);
        },
        complete: () => {
          console.log('✅ Eliminación de usuario completada.');
        }
      });

    } catch (error) {
      console.error('❌ Error en la eliminación del usuario:', error);
      this.toastr.error('Error al eliminar el usuario', 'Error');
    }
  }


}
