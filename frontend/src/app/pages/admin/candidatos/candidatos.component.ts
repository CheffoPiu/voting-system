import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { CandidatosDialogComponent } from './candidatos-dialog/candidatos-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-candidatos',
  standalone: true,
 imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './candidatos.component.html',
  styleUrl: './candidatos.component.scss'
})
export class CandidatosComponent {

  dataSource = new MatTableDataSource([]);
  action: string;
  displayedColumns: string[] = ['index', 'imagen', 'nombre', 'apellido', 'correo' , 'acciones'];
  isLoading: boolean = false;

  constructor(
    public dialog: MatDialog,
  ){

  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(CandidatosDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("resukt",result)
      if (!result) {
        // Si se cerró con Escape o clic fuera
        return;
      }

      if (result.event === 'Agregar') {
        this.addRowData(result.data);
      } else if (result.event === 'Edit') {
        this.updateRowData(result.data , result.dataId);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      } else {
        // Manejar casos donde el evento no es ninguno de los anteriores
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteRowData(data: any) {
    throw new Error('Method not implemented.');
  }
  updateRowData(data: any, dataId: any) {
    throw new Error('Method not implemented.');
  }
  addRowData(data: any) {
    throw new Error('Method not implemented.');
  }

}
