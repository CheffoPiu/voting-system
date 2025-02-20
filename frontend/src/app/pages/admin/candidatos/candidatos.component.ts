import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CandidatosDialogComponent } from './candidatos-dialog/candidatos-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { CandidatoService } from 'src/app/services/candidato.service';
import { CandidatoDTO } from 'src/app/models/candidato.dto';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './candidatos.component.html',
  styleUrl: './candidatos.component.scss'
})
export class CandidatosComponent implements OnInit {
  dataSource = new MatTableDataSource<CandidatoDTO>([]);
  displayedColumns: string[] = ['index', 'imagen', 'nombre', 'apellido', 'partido', 'numeroLista', 'acciones'];
  isLoading = false;

  constructor(private dialog: MatDialog, private candidatoService: CandidatoService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCandidatos();
  }

  async loadCandidatos() {
    this.isLoading = true;
    this.candidatoService.listCandidatos().subscribe({
      next: (candidatos) => {
        console.log('Candidatos obtenidos:', candidatos);
        this.dataSource.data = candidatos;
      },
      error: (error) => {
        console.error('❌ Error al obtener candidatos:', error);
      },
      complete: () => {
        this.isLoading = false;
        console.log('✅ Petición de candidatos completada.');
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, candidato: any): void {
    const dialogRef = this.dialog.open(CandidatosDialogComponent, {
      width: '600px',
      data: { action: action, data: candidato },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result")
      if (result?.event === 'Agregar') {
        this.saveCandidato(result.data);
      } else if (result?.event === 'Edit') {
        this.editCandidato(result.data);
      } else if (result?.event === 'Delete') {
        this.deleteCandidato(result.data.id);
      }
    });
  }

  async saveCandidato(candidato: CandidatoDTO) {
    try {
      this.candidatoService.createCandidato(candidato).subscribe({
        next: (response) => {
          console.log('✅ Candidato creado:', response);
          this.toastr.success('Candidato creado correctamente', 'Éxito');
          this.loadCandidatos();
        },
        error: (error) => {
          this.toastr.error('Error al crear el candidato', 'Error');
          console.error('❌ Error al crear candidato:', error);
        }
      });
    } catch (error) {
      console.error('❌ Error en el guardado:', error);
      this.toastr.error('Error al crear el candidato', 'Error');
    }
  }

  async editCandidato(candidato: CandidatoDTO) {
    console.log("candidado",candidato)
    this.candidatoService.editCandidato(candidato).subscribe({
      next: () => {
        this.toastr.success('Candidato actualizado correctamente', 'Éxito');
        this.loadCandidatos();
      },
      error: (error) => {
        this.toastr.error('Error al actualizar candidato', 'Error');
        console.error('❌ Error al actualizar candidato:', error);
      }
    });
  }

  async deleteCandidato(id: any) {
    this.candidatoService.deleteCandidato(id).subscribe({
      next: () => {
        this.toastr.success('Candidato eliminado correctamente', 'Éxito');
        this.loadCandidatos();
      },
      error: (error) => {
        this.toastr.error('Error al eliminar candidato', 'Error');
        console.error('❌ Error al eliminar candidato:', error);
      }
    });
  }
}
