import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';
import { ToastrService } from 'ngx-toastr';

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
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['index', 'nombre', 'correo', 'tipo', 'equipo' , 'acciones'];

  constructor(private dialog: MatDialog,
    private toastr: ToastrService,
  
  ) {}


  ngOnInit(): void {
    this.loadUsuarios();
  }

  async loadUsuarios() {
    //var usuarios = await this.userServices.listUsuarios();
    //this.dataSource.data = usuarios
    //console.log("usuarios",usuarios)
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
        this.deleteUser(result.data);
      }
    });
  }


  async saveUser(user: any){
    try {
      console.log("CrearUsuario",user)
      //await this.userServices.createUsuario(user)
      await this.loadUsuarios();

      this.toastr.success('Usuario creado correctamente', 'Éxito');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      this.toastr.error('Error al crear el usuario', 'Error');

    }
  }


  async editUser(user: any){
    try {
      delete user.equipo,
      delete user.__typename,
      delete user.updatedAt,
      delete user.createdAt

      //await this.userServices.editUsuario(user)
      await this.loadUsuarios();
      this.toastr.success('Usuario editado correctamente', 'Éxito');
    } catch (error) {
      console.error('Error al editar el usuario:', error);
      this.toastr.error('Error al editar el usuario', 'Error');

    }
  }

  async deleteUser(user: any){
    try {
      //await this.userServices.deleteUsuario(user.id)
      await this.loadUsuarios();
      this.toastr.success('Usuario eliminado correctamente', 'Éxito');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        this.toastr.error('Error al eliminar el usuario', 'Error');
      }
  }

}
