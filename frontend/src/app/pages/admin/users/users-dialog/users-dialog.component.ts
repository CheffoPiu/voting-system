import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-users-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss'],
})
export class UsersDialogComponent {
  roles = [
    { value: 'SuperAdmin', label: 'SuperAdmin' },
    { value: 'Admin', label: 'Administrador' },
    { value: 'Presidente', label: 'Presidente' },
    { value: 'Jugador', label: 'Jugador' },
  ];
  local_data: any;
  action: any;
  equipos: any[] = []; // Lista de equipos

  constructor(
    public dialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { data: any; action: string },// Recibimos `data` y `action`
  ) {
    this.local_data = { ...dialogData.data };
    this.action = dialogData.action; // Extraemos la acción
  }

  ngOnInit(): void {
    console.log("local_data",this.local_data)
    this.loadEquipos();
  }

  async loadEquipos(): Promise<void> {
    try {
      //this.equipos = await this.equipoService.listEquipos();
      console.log('Equipos cargados:', this.equipos);
    } catch (error) {
      console.error('Error al cargar los equipos:', error);
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
