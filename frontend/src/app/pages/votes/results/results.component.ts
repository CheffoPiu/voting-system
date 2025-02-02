import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/web-socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule } from '@angular/material/table'; // ✅ Agrega esto
import { VoteService } from 'src/app/services/vote.service';
import { ChartOptions } from '../../charts/area/area.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  totalUsers: number = 0;
  totalVotes: number = 0;
  usersWhoDidNotVote: number = 0;
  

  public followersChart: Partial<ChartOptions> | any;
  public totalearnChart: Partial<ChartOptions> | any;
  public earnChart: Partial<ChartOptions> | any;


  constructor(private webSocketService: WebSocketService,
    private voteService: VoteService 
  ) {
    this.followersChart = {
      series: [
        {
          name: '',
          data: [0, 150, 110, 240, 200, 200, 300, 200],
        },
      ],
      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 90,
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#5D87FF'],
      stroke: {
        curve: 'straight',
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
      },
    };

    this.totalearnChart = {
      series: [
        {
          name: '',
          data: [4, 10, 9, 7, 9, 10, 11, 8, 10],
        },
      ],
      chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 65,
        resize: true,
        barColor: '#fff',
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#49BEFF'],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: 'flat',
          endingShape: 'flat',
          columnWidth: '60%',
          barHeight: '20%',
          borderRadius: 3,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2.5,
        colors: ['rgba(0,0,0,0.01)'],
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };

    this.earnChart = {
      series: [
        {
          name: '',
          data: [0, 3, 1, 2, 8, 1, 5, 1],
        },
      ],
      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 90,
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#5D87FF'],
      stroke: {
        curve: 'straight',
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
      },
    };


  }

  ngOnInit(): void {
    this.webSocketService.listen('updateResults').subscribe((data) => {
      this.updateResults(data);
    });

    // Obtener resultados iniciales
    this.getInitialResults();
  }

  getInitialResults(): void {
    this.voteService.getResults().subscribe({
      next: (data) => this.updateResults(data),
      error: (error) => console.error('❌ Error al obtener resultados:', error),
    });
  }

  updateResults(data: any): void {
    console.log("dataResuyklt",data)
    this.totalUsers = data.totalUsers;
    this.totalVotes = data.totalVotes;
    this.usersWhoDidNotVote = data.usersWhoDidNotVote;
    this.results = data.results;
  }
}
