import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CandidatoDTO } from '../../../../models/candidato.dto';

@Component({
  selector: 'app-candidatos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './candidatos-dialog.component.html',
  styleUrls: ['./candidatos-dialog.component.scss'],
})
export class CandidatosDialogComponent implements OnInit {
  candidatoForm!: FormGroup;
  action: string;
  local_data: CandidatoDTO;

  constructor(
    public dialogRef: MatDialogRef<CandidatosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { data: CandidatoDTO; action: string },
    private fb: FormBuilder
  ) {
    this.action = dialogData.action;
    this.local_data = { ...dialogData.data };
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.candidatoForm = this.fb.group({
      cedula: [this.local_data.cedula || '', [Validators.required, Validators.pattern('[0-9]{10}'), Validators.maxLength(10)]],
      nombre: [this.local_data.nombre || '', Validators.required],
      apellido: [this.local_data.apellido || '', Validators.required],
      partido: [this.local_data.partido || '', Validators.required],
      numeroLista: [this.local_data.numeroLista || '', [Validators.required, Validators.min(1)]],
    });
  }

  doAction(): void {
    if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    } else {
      if (this.candidatoForm.valid) {
        this.dialogRef.close({ event: this.action, data: this.candidatoForm.value });
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: "Cancelar"});
  }
}
