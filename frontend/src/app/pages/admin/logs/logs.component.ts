import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-logs',
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
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {

  displayedColumns: string[] = ['index', 'imagen', 'nombre', 'apellido', 'correo' , 'acciones'];
  dataSource = new MatTableDataSource([]);
  isLoading: boolean = false;



  openDialog(action: string, obj: any): void {
    
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
