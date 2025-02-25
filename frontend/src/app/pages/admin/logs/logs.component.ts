import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { VoteService } from 'src/app/services/vote.service';

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
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  displayedColumns: string[] = ['index', 'nombre', 'apellido', 'cedula', 'email', 'candidato', 
    'partido', 'timestamp', 'origin', 'userAgent'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading: boolean = false;

  constructor(
    private voteService: VoteService
  ) {}

  ngOnInit(): void {
    this.fetchLogs();
  }


  fetchLogs(): void {
    this.isLoading = true;
    this.voteService.getVoteLogs().subscribe({
      next: (data) => {
        console.log("this.datalogs",data)

        // Ordenar los logs por timestamp (más recientes primero)
        this.dataSource.data = data.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al obtener logs detallados:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
