import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-users-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss'],
})
export class UsersDialogComponent implements OnInit {
  roles = [
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'USER', label: 'USER' },
  ];
  equipos: any[] = [];
  userForm!: FormGroup;
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { data: any; action: string },
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.action = dialogData.action;
    this.local_data = { ...dialogData.data };
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [this.local_data.id || null], // Se agrega solo si existe
      cedula: [this.local_data.cedula || '', [Validators.required, Validators.pattern('[0-9]{10}'), Validators.maxLength(10)]],
      nombre: [this.local_data.nombre || '', Validators.required],
      apellido: [this.local_data.apellido || '', Validators.required],
      email: [this.local_data.email || '', [Validators.required, Validators.email]],
      password: [this.local_data.password || '', [Validators.required, Validators.minLength(6)]],
      rol: [this.local_data.rol || '', Validators.required],
    });
    
  }

  doAction(): void {
    console.log("this.action",this.action)
    if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    } else {
      if (this.userForm.valid) {
        this.dialogRef.close({ event: this.action, data: this.userForm.value });
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
