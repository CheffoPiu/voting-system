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
  topCandidate: { name: string; votes: number } | null = null;

  public followersChart: Partial<ChartOptions> | any;
  public totalearnChart: Partial<ChartOptions> | any;
  public earnChart: Partial<ChartOptions> | any;
  public incomeChart: Partial<ChartOptions> | any;
  public expancechart: Partial<ChartOptions> | any;
  public currentyearChart: Partial<ChartOptions> | any;
  public candidato: Partial<ChartOptions> | any;

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

    this.candidato = {
      series: [
        {
          name: '',
          data: [0, 3, 10, 2, 8, 1, 5, 1],
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

    // income chart
    this.incomeChart = {
      series: [
        {
          name: '',
          data: [2.5, 3.7, 3.2, 2.6, 1.9, 2.5],
        },
        {
          name: '',
          data: [-2.8, -1.1, -3.0, -1.5, -1.9, -2.8],
        },
      ],
      chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 200,
        stacked: true,
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#5D87FF', '#5D87FF'],
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '60%',
          columnWidth: '20%',
          borderRadius: [6],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      yaxis: {
        min: -5,
        max: 5,
        tickAmount: 4,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };

    // expance chart
    this.expancechart = {
      series: [
        {
          name: '',
          data: [2.5, 3.7, 3.2, 2.6, 1.9, 2.5],
        },
        {
          name: '',
          data: [-2.8, -1.1, -3.0, -1.5, -1.9, -2.8],
        },
      ],
      chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 200,
        stacked: true,
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#49BEFF', '#49BEFF'],
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '60%',
          columnWidth: '20%',
          borderRadius: [6],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      yaxis: {
        min: -5,
        max: 5,
        tickAmount: 4,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };

    // current year chart
    this.currentyearChart = {
      series: [55, 55, 55],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",

        toolbar: {
          show: false,
        },
        height: 220,
      },
      labels: ['Income', 'Current', 'Expance'],
      colors: ['#5D87FF', '#ECF2FF', '#49BEFF'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '89%',
            background: 'transparent',

            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 7,
              },
              value: {
                show: false,
              },
              total: {
                show: true,
                color: '#2A3547',
                fontSize: '20px',
                fontWeight: '600',
                label: '$98,260',
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
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
    console.log("dataResult", data);
    this.totalUsers = data.totalUsers;
    this.totalVotes = data.totalVotes;
    this.usersWhoDidNotVote = Math.max(0, data.totalUsers - data.totalVotes);
    this.results = data.results;
    console.log("dataResults", this.results);
    // Encontrar el candidato con más votos
    if (this.results.length > 0) {
      // Encontrar el candidato con más votos
      this.topCandidate = this.results.reduce((max, candidate) => 
        Number(candidate.votes) > Number(max.votes) ? candidate : max, this.results[0]);

    }
  }
  
}
